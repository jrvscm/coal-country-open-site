#!/usr/bin/env node
/**
 * Starts Stripe CLI listener + Next.js dev server.
 *
 * 1) stripe listen --forward-to localhost:3000/api/webhooks/stripe
 * 2) Extract webhook signing secret from output
 * 3) Upsert STRIPE_WEBHOOK_SECRET in .env.local
 * 4) Start `npm run dev`
 *
 * Requires Stripe CLI:
 *   brew install stripe/stripe-cli/stripe
 */

import { spawn } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const envPath = join(process.cwd(), '.env.local');
const WH_SECRET_REGEX = /whsec_[a-zA-Z0-9]+/;
const SECRET_WAIT_MS = 20000;

function upsertEnvVar(key, value) {
  const line = `${key}=${value}`;
  let content;

  if (existsSync(envPath)) {
    content = readFileSync(envPath, 'utf8');
    const regex = new RegExp(`^${key}=.*`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, line);
    } else {
      content = `${content.trimEnd()}\n${line}\n`;
    }
  } else {
    content = `${line}\n`;
  }

  writeFileSync(envPath, content);
  console.log(`[dev-with-stripe] Updated ${key} in .env.local`);
}

function readEnvVarFromFile(key) {
  if (!existsSync(envPath)) return null;

  const content = readFileSync(envPath, 'utf8');
  const regex = new RegExp(`^${key}=(.*)$`, 'm');
  const match = content.match(regex);
  if (!match?.[1]) return null;

  const raw = match[1].trim();
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1);
  }

  return raw;
}

let nextProcess = null;

function startNext(listenerProcess) {
  if (nextProcess) return;

  nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env },
  });

  nextProcess.on('exit', (code) => {
    listenerProcess.kill();
    process.exit(code ?? 0);
  });
}

function main() {
  const stripeApiKey = process.env.STRIPE_SECRET_KEY || readEnvVarFromFile('STRIPE_SECRET_KEY');

  if (!stripeApiKey) {
    console.warn(
      '[dev-with-stripe] STRIPE_SECRET_KEY is not set. Stripe CLI will use its logged-in account context.'
    );
  }

  let secretCaptured = false;

  const listenerProcess = spawn(
    'stripe',
    [
      'listen',
      ...(stripeApiKey ? ['--api-key', stripeApiKey] : []),
      '--forward-to',
      'localhost:3000/api/webhooks/stripe',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'], shell: true }
  );

  function onListenerData(chunk, stream) {
    const text = chunk.toString();
    const prefix = stream === 'stderr' ? '[stripe stderr]' : '[stripe]';

    process.stdout.write(
      text
        .split('\n')
        .map((line) => (line ? `${prefix} ${line}\n` : ''))
        .join('')
    );

    if (!secretCaptured) {
      const match = text.match(WH_SECRET_REGEX);
      if (match) {
        upsertEnvVar('STRIPE_WEBHOOK_SECRET', match[0]);
        secretCaptured = true;
        clearTimeout(timeout);
        startNext(listenerProcess);
      }
    }
  }

  listenerProcess.stdout.on('data', (chunk) => onListenerData(chunk, 'stdout'));
  listenerProcess.stderr.on('data', (chunk) => onListenerData(chunk, 'stderr'));

  const timeout = setTimeout(() => {
    console.log('[dev-with-stripe] Still waiting for STRIPE_WEBHOOK_SECRET. Starting Next.js anyway.');
    console.log('[dev-with-stripe] When secret appears above, copy it into .env.local and restart.');
    startNext(listenerProcess);
  }, SECRET_WAIT_MS);

  listenerProcess.on('error', (err) => {
    console.error(
      '[dev-with-stripe] Failed to start Stripe CLI. Is it installed? (brew install stripe/stripe-cli/stripe)'
    );
    console.error(err.message);
    clearTimeout(timeout);
    process.exit(1);
  });

  listenerProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      clearTimeout(timeout);
      if (nextProcess) nextProcess.kill();
      process.exit(code ?? 1);
    }
  });

  process.on('SIGINT', () => {
    clearTimeout(timeout);
    listenerProcess.kill();
    if (nextProcess) nextProcess.kill();
    process.exit(0);
  });
}

main();

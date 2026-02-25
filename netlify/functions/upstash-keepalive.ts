import { Handler } from '@netlify/functions';
import { Redis } from '@upstash/redis';

const KEEPALIVE_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days

export const handler: Handler = async () => {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing Upstash env vars' }),
      };
    }

    const redis = new Redis({ url, token });
    await redis.set(
      'system:keepalive',
      JSON.stringify({ ts: new Date().toISOString(), source: 'netlify-scheduled-function' }),
      { ex: KEEPALIVE_TTL_SECONDS },
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    console.error('Upstash keepalive failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Keepalive failed' }),
    };
  }
};

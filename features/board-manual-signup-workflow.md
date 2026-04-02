# Workflow: manually add a signup (board)

Use this when someone registers **outside of Stripe** (check, cash, comp, phone-in, etc.) and you want their data in the **Registrations** sheet the same way as a paid online signup—without going through checkout.

## Steps

1. **Gather** the entrant’s information (same details you would use for a normal online registration).

2. **Open the board manual entry URL** (bookmark this). It is the usual player or sponsor registration page **with** `manual=1` in the query string, for example:
   - Player: `/registration/player?manual=1`
   - Sponsor: `/registration/sponsor?manual=1`  
   Use the full site URL your committee uses in production.

3. **Enter the admin password** in the **Admin password** field on the page. The password is **not** part of the URL; it matches `REGISTRATION_ADMIN_SECRET` in Netlify (or your host’s env). If that variable is not set, manual entry is disabled.

4. **Fill out the form** with the entrant’s information. Fields and validation match the public form (except the site can allow “sold out” website sponsorship when submitting to the sheet only).

5. Click **Submit to sheet (no payment)**.  
   - **Do not** click **Continue to Secure Payment** unless they are actually paying by card through the site.  
   - No Stripe or payment window appears for **Submit to sheet**.

6. **Confirm** the on-site success message. The row(s) are appended immediately.

7. **Open the Registrations sheet** in Google Sheets. **Do not** manually edit other tabs unless you understand how they depend on Registrations—downstream counts and site availability read from this data.

8. **Verify** the new row(s): match by time, email, name, or products. Rows from this flow use the **same columns** as paid registrations. The app writes the rightmost **status** column as **Paid** for these rows, so you **do not** need to change Pending → Paid for board manual entries.

## Old workflow (deprecated)

Previously, some committees used: fill the public form, start checkout, **close the payment window**, then find the row as **Pending** and set it to **Paid**. Prefer **`?manual=1` + Submit to sheet** instead: no abandoned checkout, no payment window, and status is already **Paid** when written.

## Reference

Technical details: [registration-board-manual-entry.md](./registration-board-manual-entry.md).

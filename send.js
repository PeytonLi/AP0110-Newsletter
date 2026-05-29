require('dotenv').config();
const nodemailer = require('nodemailer');
const { readFileSync } = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const get = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : fallback;
};

const to      = get('--to',      process.env.GMAIL_TO);
const subject = get('--subject', 'CalCompute Newsletter');
const html    = readFileSync(path.join(__dirname, 'dist', 'newsletter.html'), 'utf8');

if (!to)                        { console.error('Error: --to <email> is required'); process.exit(1); }
if (!process.env.GMAIL_USER)    { console.error('Error: GMAIL_USER not set in .env'); process.exit(1); }
if (!process.env.GMAIL_APP_PASS){ console.error('Error: GMAIL_APP_PASS not set in .env'); process.exit(1); }

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASS },
});

(async () => {
  const info = await transporter.sendMail({
    from: `"CalCompute" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
  console.log(`Sent to ${to} — Message ID: ${info.messageId}`);
})().catch(err => { console.error('Send failed:', err.message); process.exit(1); });

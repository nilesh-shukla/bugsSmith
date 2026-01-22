import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { sendVerificationEmail } from './sendEmail.js';

// Load .env from project root if script is executed from a different cwd
dotenv.config();
if (!process.env.EMAIL_USER && !process.env.TEST_EMAIL_TO) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const envPath = path.resolve(__dirname, '..', '.env');
  dotenv.config({ path: envPath });
}

(async () => {
  const testTo = process.env.TEST_EMAIL_TO || process.env.EMAIL_USER;
  if (!testTo) {
    console.error('No recipient configured. Set TEST_EMAIL_TO or EMAIL_USER in .env');
    process.exit(1);
  }

  try {
    const token = '000000-test-token';
    console.log('Sending test verification email to', testTo);
    const res = await sendVerificationEmail(testTo, token);
    console.log('Test send result:', res && res.provider ? res.provider : res);
    process.exit(0);
  } catch (err) {
    console.error('Test email failed:', err && err.message ? err.message : err);
    process.exit(2);
  }
})();

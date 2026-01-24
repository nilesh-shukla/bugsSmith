import nodemailer from 'nodemailer';

const MAX_RETRIES = 3;
let nodemailerReady = false;
let transporter = null;

function initNodemailer() {
    if (transporter) return transporter;
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    transporter.verify()
        .then(() => {
            nodemailerReady = true;
            console.log('Nodemailer transporter verified');
        })
        .catch((err) => {
            nodemailerReady = false;
            console.error('Nodemailer verification failed:', err && err.message ? err.message : err);
        });

    return transporter;
}

async function sendWithNodemailer(to, subject, html) {
    initNodemailer();
    if (!transporter) throw new Error('Nodemailer transporter not configured');

    let lastErr;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const info = await transporter.sendMail({
                from: '"BugsSmith" <no-reply@bugssmith.com>',
                to,
                subject,
                html,
            });
            return { provider: 'nodemailer', info };
        } catch (err) {
            lastErr = err;
            const backoff = 200 * attempt;
            console.warn(`Nodemailer send attempt ${attempt} failed, retrying in ${backoff}ms`);
            await new Promise(r => setTimeout(r, backoff));
        }
    }
    throw lastErr;
}

async function sendWithSendGrid(to, subject, html) {
    // dynamic import so project doesn't require @sendgrid/mail unless used
    const sg = (await import('@sendgrid/mail')).default;
    sg.setApiKey(process.env.SENDGRID_API_KEY);

    let lastErr;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const res = await sg.send({
                to,
                from: process.env.SENDGRID_FROM || process.env.EMAIL_USER || 'no-reply@bugssmith.com',
                subject,
                html,
            });
            return { provider: 'sendgrid', info: res };
        } catch (err) {
            lastErr = err;
            const backoff = 200 * attempt;
            console.warn(`SendGrid send attempt ${attempt} failed, retrying in ${backoff}ms`);
            await new Promise(r => setTimeout(r, backoff));
        }
    }
    throw lastErr;
}

export async function sendVerificationEmail(email, token) {

    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyUrl = `${frontendBase}/verify-pending?token=${token}&email=${encodeURIComponent(email)}`;

    const subject = 'Verify your email';
    const html = `
        <h2>Verify your email</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verifyUrl}">Verify Email</a>
    `;

    // Prefer SendGrid if configured
    if (process.env.SENDGRID_API_KEY) {
        try {
            return await sendWithSendGrid(email, subject, html);
        } catch (err) {
            console.error('SENDGRID SEND ERROR:', err && err.message ? err.message : err);
            // Fall back to nodemailer if credentials available
        }
    }

    // Use nodemailer as fallback
    try {
        return await sendWithNodemailer(email, subject, html);
    } catch (err) {
        console.error('Nodemailer send error:', err && err.message ? err.message : err);
        throw err;
    }
}
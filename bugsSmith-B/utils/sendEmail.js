import nodemailer from 'nodemailer';

const transporter  = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function sendVerificationEmail(email, token){
    const verifyUrl = `http://localhost:5173/verify-email?token=${token}`;
    await transporter.sendMail({
        from: '"BugsSmith" <no-reply@bugssmith.com>',
        to: email,
        subject: 'Verify your email',
        html: `
            <h2>Verify your email</h2>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verifyUrl}">Verify Email</a>
        `
    });
}
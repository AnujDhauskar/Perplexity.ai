import nodemailer from 'nodemailer';

const hasAppPasswordAuth =
    Boolean(process.env.GOOGLE_USER) && Boolean(process.env.GOOGLE_APP_PASSWORD);

const hasOAuthAuth =
    Boolean(process.env.GOOGLE_USER) &&
    Boolean(process.env.GOOGLE_CLIENT_ID) &&
    Boolean(process.env.GOOGLE_CLIENT_SECRET) &&
    Boolean(process.env.GOOGLE_REFRESH_TOKEN);

const authConfig = hasAppPasswordAuth
    ? {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
    }
    : hasOAuthAuth
        ? {
            type: "OAuth2",
            user: process.env.GOOGLE_USER,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        }
        : null;

const transporter = authConfig
    ? nodemailer.createTransport({
        service: "gmail",
        auth: authConfig,
    })
    : null;

if (!transporter) {
    console.warn(
        "Email transporter is not configured. Set GOOGLE_APP_PASSWORD or OAuth credentials to enable emails."
    );
} else {
    transporter.verify()
        .then(() => {
            const mode = hasAppPasswordAuth ? "App Password" : "OAuth2";
            console.log(`Email transporter is ready to send email (${mode}).`);
        })
        .catch((err) => {
            if (err?.code === "EAUTH") {
                console.error(
                    "Email auth failed. Your Gmail OAuth refresh token is expired/revoked. " +
                    "Use a new GOOGLE_REFRESH_TOKEN or set GOOGLE_APP_PASSWORD."
                );
                return;
            }

            console.error("Email transporter verification failed:", err.message || err);
        });
}

export async function sendEmail({to, subject, html, text}) {
    if (!transporter) {
        throw new Error(
            "Email transporter is not configured. Set GOOGLE_APP_PASSWORD or valid OAuth env vars."
        );
    }

    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text
    };

    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", details);
}

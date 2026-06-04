import nodemailer from "nodemailer";

export const sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.BREVO_USER,
    to,
    subject: "Your OTP Code",
    html: `
      <div style="font-family:sans-serif;padding:20px">
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
      </div>
    `,
  });

  console.log("EMAIL SENT");
};
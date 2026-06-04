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

  const info = await transporter.sendMail({
    from: '"Headga" <lakshmistla17@gmail.com>',
    to,
    subject: "Your OTP Code",
    html: `
      <h2>Email Verification</h2>
      <h1>${otp}</h1>
    `,
  });

  console.log(info.messageId);
};
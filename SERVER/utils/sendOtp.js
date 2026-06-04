import nodemailer from "nodemailer";

export const sendOtpEmail = async (to, otp) => {
  try {
    console.log("CREATING TRANSPORT");

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });

    console.log("VERIFYING SMTP");

    await transporter.verify();

    console.log("SMTP VERIFIED");

    console.log("SENDING EMAIL");

    const info = await transporter.sendMail({
      from: '"Headga" <lakshmistla17@gmail.com>',
      to,
      subject: "Your OTP Code",
      html: `
        <h2>Email Verification</h2>
        <h1>${otp}</h1>
      `,
    });

    console.log("EMAIL SENT");
    console.log(info);
  } catch (err) {
    console.error("BREVO ERROR:", err);
    throw err;
  }
};
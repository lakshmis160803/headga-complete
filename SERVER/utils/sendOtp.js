import nodemailer from "nodemailer";

export const sendOtpEmail = async (to, otp) => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log(
    "EMAIL_PASS:",
    process.env.EMAIL_PASS ? "FOUND" : "MISSING"
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("SMTP VERIFIED");
  } catch (err) {
    console.error("SMTP ERROR:", err);
    throw err;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
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
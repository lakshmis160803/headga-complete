export const sendOtpEmail = async (to, otp) => {
  try {
    console.log("SENDING EMAIL via Brevo HTTP API");

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.KEY,
      },
      body: JSON.stringify({
        sender: { email: "lakshmistla17@gmail.com", name: "Headga" },
        to: [{ email: to }],
        subject: "Your OTP Code",
        htmlContent: `<h2>Email Verification</h2><h1>${otp}</h1>`,
      }),
    });

    const data = await response.json();
    console.log("EMAIL SENT", data);
  } catch (err) {
    console.error("BREVO ERROR:", err);
    throw err;
  }
};
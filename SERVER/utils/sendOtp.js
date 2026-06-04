import * as Brevo from "@getbrevo/brevo";

export const sendOtpEmail = async (to, otp) => {
  try {
    console.log("SETTING UP BREVO API");

    const client = Brevo.ApiClient.instance;
    client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

    const emailApi = new Brevo.TransactionalEmailsApi();

    console.log("SENDING EMAIL");

    const info = await emailApi.sendTransacEmail({
      sender: { email: "lakshmistla17@gmail.com", name: "Headga" },
      to: [{ email: to }],
      subject: "Your OTP Code",
      htmlContent: `
        <h2>Email Verification</h2>
        <h1>${otp}</h1>
      `,
    });

    console.log("EMAIL SENT", info);
  } catch (err) {
    console.error("BREVO ERROR:", err);
    throw err;
  }
};
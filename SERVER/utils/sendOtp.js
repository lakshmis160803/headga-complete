import * as SibApiV3Sdk from "@getbrevo/brevo";

export const sendOtpEmail = async (to, otp) => {
  try {
    const client = new SibApiV3Sdk.BrevoClient(process.env.KEY);

    console.log("BREVO CLIENT METHODS:", Object.getOwnPropertyNames(Object.getPrototypeOf(client)));

    console.log("SENDING EMAIL");

    const info = await client.emailCampaigns.sendTransacEmail({
      sender: { email: "lakshmistla17@gmail.com", name: "Headga" },
      to: [{ email: to }],
      subject: "Your OTP Code",
      htmlContent: `<h2>Email Verification</h2><h1>${otp}</h1>`,
    });

    console.log("EMAIL SENT", info);
  } catch (err) {
    console.error("BREVO ERROR:", err);
    throw err;
  }
};
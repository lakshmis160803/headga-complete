import * as SibApiV3Sdk from "@getbrevo/brevo";

export const sendOtpEmail = async (to, otp) => {
  try {
    console.log("BREVO SDK keys:", Object.keys(SibApiV3Sdk));

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = "Your OTP Code";
    sendSmtpEmail.htmlContent = `<h2>Email Verification</h2><h1>${otp}</h1>`;
    sendSmtpEmail.sender = { email: "lakshmistla17@gmail.com", name: "Headga" };
    sendSmtpEmail.to = [{ email: to }];

    console.log("SENDING EMAIL");
    const info = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("EMAIL SENT", info);
  } catch (err) {
    console.error("BREVO ERROR:", err);
    throw err;
  }
};
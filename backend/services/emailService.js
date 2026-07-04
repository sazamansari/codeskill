const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

// Read credentials from env
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    ...(process.env.AWS_SESSION_TOKEN && { sessionToken: process.env.AWS_SESSION_TOKEN }),
  },
});

const sendOTPEmail = async (toEmail, otp) => {
  const senderEmail = process.env.AWS_SES_SENDER || "noreply@codeskill.com";

  const params = {
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #2563EB;">CodeSkill Authentication</h2>
              <p>Hello,</p>
              <p>Your one-time password (OTP) for logging in is:</p>
              <h1 style="font-size: 32px; letter-spacing: 4px; color: #1e293b;">${otp}</h1>
              <p>This code will expire in 5 minutes.</p>
              <p>If you did not request this, please ignore this email.</p>
              <hr style="border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} CodeSkill. All rights reserved.</p>
            </div>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `Your CodeSkill OTP is: ${otp}. It expires in 5 minutes.`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Your CodeSkill Login Code: ${otp}`,
      },
    },
    Source: senderEmail,
  };

  try {
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);
    console.log(`[SES] Email sent to ${toEmail}. MessageId: ${result.MessageId}`);
    return result;
  } catch (error) {
    console.error("[SES] Error sending email:", error);
    // In local development, if AWS isn't configured, we just log the OTP
    if (error.name === "CredentialsProviderError" || !process.env.AWS_ACCESS_KEY_ID) {
      console.warn(`[SES WARNING] AWS Credentials not configured. Simulated OTP for ${toEmail}: ${otp}`);
      return { simulated: true, otp };
    }
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
};

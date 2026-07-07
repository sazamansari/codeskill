const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

// Build SES client config — uses EC2 IAM role automatically if no explicit creds
const sesConfig = {
  region: process.env.AWS_REGION || "ap-south-1",
};

// Only set explicit credentials if they are real (not placeholders)
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
if (accessKey && secretKey && !accessKey.startsWith("your_")) {
  sesConfig.credentials = {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    ...(process.env.AWS_SESSION_TOKEN && !process.env.AWS_SESSION_TOKEN.startsWith("your_") && { sessionToken: process.env.AWS_SESSION_TOKEN }),
  };
}

const sesClient = new SESClient(sesConfig);

const sendOTPEmail = async (toEmail, otp) => {
  const senderEmail = (process.env.AWS_SES_SENDER || "noreply@evolvian.in").trim();
  const recipientEmail = toEmail ? toEmail.trim() : "";

  const params = {
    Destination: {
      ToAddresses: [recipientEmail],
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
    console.error("[SES] Error sending email:", error.message || error);
    throw new Error("Failed to send OTP email. Please check AWS SES configuration.");
  }
};

module.exports = {
  sendOTPEmail,
};

const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

// ── Credential Setup ──────────────────────────────────────────────────
// IMPORTANT: dotenv loads ALL .env vars into process.env BEFORE this runs.
// The AWS SDK's default credential provider chain reads AWS_ACCESS_KEY_ID,
// AWS_SECRET_ACCESS_KEY, and AWS_SESSION_TOKEN from process.env automatically.
// If these contain placeholder values (e.g. "your_aws_access_key"), the SDK
// will try to use them — and if AWS_SESSION_TOKEN is a garbage placeholder,
// it gets mixed with valid IAM role credentials on EC2, causing:
//   "The security token included in the request is invalid."
//
// Fix: Actively DELETE placeholder AWS env vars so the SDK ignores them
// and falls through to the EC2 instance metadata (IAM role) credentials.

const isPlaceholder = (val) => !val || val.startsWith("your_") || val === "";

// Clean up placeholder env vars to prevent AWS SDK from picking them up
if (isPlaceholder(process.env.AWS_ACCESS_KEY_ID)) {
  delete process.env.AWS_ACCESS_KEY_ID;
}
if (isPlaceholder(process.env.AWS_SECRET_ACCESS_KEY)) {
  delete process.env.AWS_SECRET_ACCESS_KEY;
}
if (isPlaceholder(process.env.AWS_SESSION_TOKEN)) {
  delete process.env.AWS_SESSION_TOKEN;
}

const sesConfig = {
  region: process.env.AWS_REGION || "ap-south-1",
};

// If real credentials exist in env after cleanup, set them explicitly
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
if (accessKey && secretKey) {
  sesConfig.credentials = {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    ...(process.env.AWS_SESSION_TOKEN && { sessionToken: process.env.AWS_SESSION_TOKEN }),
  };
  console.log("[SES] Using explicit credentials from environment variables");
} else {
  console.log("[SES] No explicit credentials — using EC2 IAM role / default provider chain");
}

const sesClient = new SESClient(sesConfig);

// Simple email format validation
const isValidEmail = (email) => {
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const sendOTPEmail = async (toEmail, otp) => {
  const senderEmail = (process.env.AWS_SES_SENDER || "noreply@evolvian.in").trim();
  const recipientEmail = toEmail ? toEmail.trim().toLowerCase() : "";

  // Validate emails before attempting to send
  if (!isValidEmail(recipientEmail)) {
    console.error(`[SES] Invalid recipient email format: "${recipientEmail}"`);
    throw new Error(`Invalid recipient email: "${recipientEmail}"`);
  }

  if (!isValidEmail(senderEmail)) {
    console.error(`[SES] Invalid sender email format: "${senderEmail}"`);
    throw new Error(`Invalid sender email configured: "${senderEmail}"`);
  }

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

  // Retry logic: attempt up to 2 times with a short delay
  const maxRetries = 2;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const command = new SendEmailCommand(params);
      const result = await sesClient.send(command);
      console.log(`[SES] Email sent to ${recipientEmail}. MessageId: ${result.MessageId}`);
      return result;
    } catch (error) {
      lastError = error;
      const errorCode = error.name || error.Code || "Unknown";
      const errorMessage = error.message || "Unknown error";

      console.error(`[SES] Attempt ${attempt}/${maxRetries} failed for ${recipientEmail}:`);
      console.error(`[SES]   Error Code: ${errorCode}`);
      console.error(`[SES]   Error Message: ${errorMessage}`);
      console.error(`[SES]   Sender: ${senderEmail}`);
      console.error(`[SES]   Region: ${sesConfig.region}`);

      // Don't retry on permanent/client errors
      if (
        errorCode === "MessageRejected" ||
        errorCode === "MailFromDomainNotVerifiedException" ||
        errorCode === "ConfigurationSetDoesNotExistException" ||
        errorCode === "AccountSendingPausedException" ||
        errorCode === "InvalidParameterValue" ||
        error.$metadata?.httpStatusCode === 400 ||
        error.$metadata?.httpStatusCode === 403
      ) {
        console.error(`[SES]   Non-retryable error, skipping retry.`);
        break;
      }

      // Wait before retry (only if not the last attempt)
      if (attempt < maxRetries) {
        const delay = attempt * 1000; // 1s, 2s
        console.log(`[SES]   Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All attempts failed — throw with the actual SES error details
  const errorCode = lastError?.name || lastError?.Code || "Unknown";
  const errorMsg = lastError?.message || "Unknown error";
  throw new Error(`Failed to send OTP email to ${recipientEmail}. SES Error [${errorCode}]: ${errorMsg}`);
};

module.exports = {
  sendOTPEmail,
};

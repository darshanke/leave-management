const nodemailer = require('nodemailer');
const { FRONTEND_URL, EMAIL_FROM, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

const sendLeaveNotificationToManager = async ({ to, leaveId, applicantName, days, type, reasonType }) => {
 
const html = `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 24px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color: #4f46e5;">Leave Request Notification</h2>

      <p style="font-size: 16px; color: #333;">
        <strong>${applicantName}</strong> has submitted a leave request.
      </p>

      <table style="width: 100%; margin-top: 16px; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: 500; color: #555;">Type:</td>
          <td style="padding: 8px 0;">${type}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 500; color: #555;">Reason:</td>
          <td style="padding: 8px 0;">${reasonType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 500; color: #555;">Days Requested:</td>
          <td style="padding: 8px 0;">${days}</td>
        </tr>
      </table>

      <p style="margin-top: 24px; font-size: 15px; color: #444;">
        If no action is taken within <strong>24 hours</strong>, this request will be <span style="color: #d97706;"><strong>automatically forwarded</strong></span> to HR.
      </p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://your-app-url.com/login" target="_blank"
           style="background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
          Review & Act Now
        </a>
      </div>

      <p style="margin-top: 32px; font-size: 13px; color: #888; text-align: center;">
        Leave Management System • Please do not reply to this automated email
      </p>
    </div>
  </div>
`;

  await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject: `Leave Request from ${applicantName}`,
    html
  });
};

const sendEmail = async (opts = {}) => {
  await transporter.sendMail({
    from: EMAIL_FROM,
    ...opts
  });
};

module.exports = { sendLeaveNotificationToManager, sendEmail };

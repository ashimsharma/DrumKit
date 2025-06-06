import nodemailer from "nodemailer";

export default function sendVerificationEmail(userEmail, otp) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: userEmail,
        subject: "Drum Kit Email Verification",
        html: `<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; background: #f9f9f9;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', sans-serif; background: #ffffff; color: #333;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; color: #111;">🔐 Your Drumkit OTP</h1>
              <p style="font-size: 16px; color: #555;">Use the code below to complete your login. This code will expire in 10 minutes.</p>
              <div style="margin: 30px auto; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1a73e8;">
                ${otp}
              </div>
              <p style="font-size: 14px; color: #888;">If you did not request this, please ignore this email</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // console.error("Error sending email: ", error);
        } else {
            // console.log("Email sent: ", info.response);
        }
    });
}

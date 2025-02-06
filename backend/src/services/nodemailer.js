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
        html: `<p>Your OTP code is: </br><strong>${otp}</strong>.<br>It expires in 10 minutes.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // console.error("Error sending email: ", error);
        } else {
            // console.log("Email sent: ", info.response);
        }
    });
}

// server/utils/sendEmail.js

import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,      // your email address
        pass: process.env.EMAIL_PASS,      // your email app password
      },
    });

    const mailOptions = {
      from: `"DeptHub Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
};

export default sendEmail;

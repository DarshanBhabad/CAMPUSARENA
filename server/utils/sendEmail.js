const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const message = {
    from: `CampusArena <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  await transporter.sendMail(message);
};

module.exports = { sendEmail };
const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendRegistrationConfirmation = async (userEmail, userName, eventTitle, eventDate, eventLocation) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@campusarena.com',
      to: userEmail,
      subject: `Registration Confirmed: ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Registration Confirmed!</h2>
          <p>Dear ${userName},</p>
          <p>Your registration for the following event has been confirmed:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">${eventTitle}</h3>
            <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
            <p><strong>Location:</strong> ${eventLocation}</p>
          </div>
          <p>We look forward to seeing you at the event!</p>
          <p>Best regards,<br>CampusArena Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Registration confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send confirmation email');
  }
};

const sendEventReminder = async (userEmail, userName, eventTitle, eventDate) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@campusarena.com',
      to: userEmail,
      subject: `Event Reminder: ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Event Reminder</h2>
          <p>Dear ${userName},</p>
          <p>This is a reminder that you have registered for:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">${eventTitle}</h3>
            <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
          </div>
          <p>Don't forget to attend!</p>
          <p>Best regards,<br>CampusArena Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Reminder email sending failed:', error);
  }
};

module.exports = {
  sendRegistrationConfirmation,
  sendEventReminder
};
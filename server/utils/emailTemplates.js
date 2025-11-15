const registrationConfirmation = (user, event) => {
  return {
    subject: `Registration Confirmed: ${event.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Registration Confirmed!</h2>
        <p>Hi ${user.username},</p>
        <p>You have successfully registered for <strong>${event.title}</strong>.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Event Details:</h3>
          <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${new Date(event.date).toLocaleTimeString()}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p><strong>Category:</strong> ${event.category}</p>
          ${event.fees > 0 ? `<p><strong>Amount Paid:</strong> ₹${event.fees}</p>` : '<p><strong>Fee:</strong> Free</p>'}
        </div>
        
        <p>We look forward to seeing you at the event!</p>
        <p>Best regards,<br>CampusArena Team</p>
      </div>
    `
  };
};

const eventReminder = (user, event) => {
  return {
    subject: `Reminder: ${event.title} is tomorrow!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Event Reminder</h2>
        <p>Hi ${user.username},</p>
        <p>This is a friendly reminder that <strong>${event.title}</strong> is scheduled for tomorrow.</p>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Event Details:</h3>
          <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${new Date(event.date).toLocaleTimeString()}</p>
          <p><strong>Location:</strong> ${event.location}</p>
        </div>
        
        <p>Don't forget to bring your QR code for quick check-in!</p>
        <p>See you there!</p>
        <p>Best regards,<br>CampusArena Team</p>
      </div>
    `
  };
};

const eventCancellation = (user, event) => {
  return {
    subject: `Event Cancelled: ${event.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Event Cancelled</h2>
        <p>Hi ${user.username},</p>
        <p>We regret to inform you that <strong>${event.title}</strong> has been cancelled.</p>
        
        ${event.fees > 0 ? `
        <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Refund Information:</h3>
          <p>Your payment of ₹${event.fees} will be refunded within 5-7 business days.</p>
        </div>
        ` : ''}
        
        <p>We apologize for any inconvenience caused.</p>
        <p>Best regards,<br>CampusArena Team</p>
      </div>
    `
  };
};

module.exports = {
  registrationConfirmation,
  eventReminder,
  eventCancellation
};
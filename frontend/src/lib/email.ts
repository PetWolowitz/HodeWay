import sgMail from "@sendgrid/mail";

// Initialize SendGrid only if API key is available
const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY;
const isEmailEnabled = !!SENDGRID_API_KEY;

if (isEmailEnabled) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition: 'attachment';
  }>;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!isEmailEnabled) {
    console.log('Email sending disabled - no SendGrid API key provided');
    return false;
  }

  try {
    const msg = {
      to: options.to,
      from: 'noreply@yourdomain.com', // Use your verified domain
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendCollaborationInvite(
  to: string,
  itineraryTitle: string,
  inviterName: string,
  role: 'editor' | 'viewer',
  acceptUrl: string
): Promise<boolean> {
  if (!isEmailEnabled) {
    console.log('Email sending disabled - collaboration invite not sent');
    return false;
  }

  const subject = `Invitation to collaborate on "${itineraryTitle}"`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d3748;">Travel Itinerary Collaboration Invitation</h2>
      <p style="color: #4a5568;">
        ${inviterName} has invited you to collaborate on the travel itinerary "${itineraryTitle}" 
        as a ${role}.
      </p>
      <p style="color: #4a5568;">
        As a ${role}, you will be able to:
        ${role === 'editor' 
          ? `
            <ul>
              <li>View all itinerary details</li>
              <li>Add and modify destinations</li>
              <li>Manage transportation details</li>
              <li>Add expenses and notes</li>
            </ul>
          `
          : `
            <ul>
              <li>View all itinerary details</li>
              <li>View transportation details</li>
              <li>View expenses and notes</li>
            </ul>
          `
        }
      </p>
      <div style="margin: 30px 0;">
        <a href="${acceptUrl}" 
           style="background-color: #4299e1; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Accept Invitation
        </a>
      </div>
      <p style="color: #718096; font-size: 0.875rem;">
        If you don't want to accept this invitation, you can ignore this email.
      </p>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    text: `${inviterName} has invited you to collaborate on "${itineraryTitle}" as a ${role}. 
           Visit ${acceptUrl} to accept the invitation.`,
    html
  });
}

export async function sendItineraryUpdate(
  to: string,
  itineraryTitle: string,
  updaterName: string,
  changes: string[],
  viewUrl: string
): Promise<boolean> {
  if (!isEmailEnabled) {
    console.log('Email sending disabled - itinerary update notification not sent');
    return false;
  }

  const subject = `Updates to "${itineraryTitle}"`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d3748;">Itinerary Update Notification</h2>
      <p style="color: #4a5568;">
        ${updaterName} has made changes to the itinerary "${itineraryTitle}".
      </p>
      <div style="margin: 20px 0; padding: 15px; background-color: #f7fafc; border-radius: 5px;">
        <h3 style="color: #2d3748; margin-top: 0;">Changes made:</h3>
        <ul style="color: #4a5568;">
          ${changes.map(change => `<li>${change}</li>`).join('')}
        </ul>
      </div>
      <div style="margin: 30px 0;">
        <a href="${viewUrl}" 
           style="background-color: #4299e1; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          View Itinerary
        </a>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    text: `${updaterName} has made changes to "${itineraryTitle}": \n\n${changes.join('\n')}\n\nView at: ${viewUrl}`,
    html
  });
}

export async function sendTransportReminder(
  to: string,
  transport: {
    type: string;
    provider: string;
    departure: {
      datetime: string;
      location: string;
      terminal?: string;
    };
    arrival: {
      location: string;
    };
    booking_reference: string;
    seats?: string[];
  }
): Promise<boolean> {
  if (!isEmailEnabled) {
    console.log('Email sending disabled - transport reminder not sent');
    return false;
  }

  const departureTime = new Date(transport.departure.datetime);
  const subject = `Transport Reminder: ${transport.type.toUpperCase()} to ${transport.arrival.location}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d3748;">Transport Departure Reminder</h2>
      <div style="background-color: #f7fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2d3748; margin-top: 0;">
          ${transport.type.toUpperCase()} Details
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #4a5568;"><strong>Provider:</strong></td>
            <td style="padding: 8px 0; color: #4a5568;">${transport.provider}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4a5568;"><strong>Departure:</strong></td>
            <td style="padding: 8px 0; color: #4a5568;">
              ${departureTime.toLocaleString()}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4a5568;"><strong>From:</strong></td>
            <td style="padding: 8px 0; color: #4a5568;">
              ${transport.departure.location}
              ${transport.departure.terminal ? ` (Terminal ${transport.departure.terminal})` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4a5568;"><strong>To:</strong></td>
            <td style="padding: 8px 0; color: #4a5568;">${transport.arrival.location}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4a5568;"><strong>Reference:</strong></td>
            <td style="padding: 8px 0; color: #4a5568;">${transport.booking_reference}</td>
          </tr>
          ${transport.seats ? `
          <tr>
            <td style="padding: 8px 0; color: #4a5568;"><strong>Seats:</strong></td>
            <td style="padding: 8px 0; color: #4a5568;">${transport.seats.join(', ')}</td>
          </tr>
          ` : ''}
        </table>
      </div>
      <p style="color: #718096; font-size: 0.875rem;">
        Remember to check in and arrive at the departure location with sufficient time.
      </p>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    text: `
      Transport Departure Reminder
      
      ${transport.type.toUpperCase()} Details:
      Provider: ${transport.provider}
      Departure: ${departureTime.toLocaleString()}
      From: ${transport.departure.location}${transport.departure.terminal ? ` (Terminal ${transport.departure.terminal})` : ''}
      To: ${transport.arrival.location}
      Reference: ${transport.booking_reference}
      ${transport.seats ? `Seats: ${transport.seats.join(', ')}` : ''}
      
      Remember to check in and arrive at the departure location with sufficient time.
    `,
    html
  });
}
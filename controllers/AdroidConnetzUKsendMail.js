import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API)

export const sendQueryMailForAdroidUK = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    organization,
    service,
    message
  } = req.body

  // Validate required fields
  if (!firstName || !lastName || !email || !organization || !service || !message) {
    return res.status(400).json({
      error: 'Please fill all required fields: firstName, lastName, email, organization, service, message',
    })
  }

  // Construct the email message
  const msg = {
    to: 'info@adroidconnectz.co.uk', // ✅ Final recipient
    from: {
      name: `${firstName} ${lastName}`,
      email: 'no-reply@adroidconnectz.co.uk', // ✅ Verified sender in SendGrid
    },
    subject: 'New Contact Form Submission - Adroid Connectz',
    html: `
      <p>Hello Adroid Connectz Team,</p>
      <p>You have received a new message via your contact form:</p>
      <ul>
        <li><strong>First Name:</strong> ${firstName}</li>
        <li><strong>Last Name:</strong> ${lastName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Organization:</strong> ${organization}</li>
        <li><strong>Service Interested In:</strong> ${service}</li>
        <li><strong>Message:</strong> ${message}</li>
      </ul>
      <p>Please respond to this inquiry at your earliest convenience.</p>
      <p>Regards,<br/>Adroid Connectz Contact System</p>
    `,
  }

  try {
    await sgMail.send(msg)
    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error.response?.body || error)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}

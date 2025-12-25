

import { sendEmail } from "../services/emailService.js";

export const sendQueryMailForAdroidUK = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    organization,
    service,
    message,
  } = req.body;

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !organization ||
    !service ||
    !message
  ) {
    return res.status(400).json({
      error:
        "Please fill all required fields: firstName, lastName, email, organization, service, message",
    });
  }

  const htmlContent = `
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

    <p>
      Regards,<br/>
      <strong>Adroid Connectz Contact System</strong>
    </p>
  `;

  try {
    await sendEmail({
      to: "info@adroidconnectz.co.uk",
      subject: "New Contact Form Submission - Adroid Connectz",
      htmlContent,
      senderName: `${firstName} ${lastName}`,
      senderEmail: "adroidjournal@gmail.com",
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({
      error: "Failed to send email",
    });
  }
};

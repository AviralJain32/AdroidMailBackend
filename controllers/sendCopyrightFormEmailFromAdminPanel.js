import { sendEmail } from "../services/emailService.js";

export const sendCopyrightFormEmailFromAdminPanel = async (req, res) => {
    const {name, paperID, title, jounralID, email} = req.body;

    // Validate the input data
    if (!title || !paperID || !jounralID || !email) {
        return res.status(400).json({ error: "Please provide title, email, and other required fields" });
    }
    // Construct the email message
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h1>Thank you for your submission, ${name}</h1>
            <p>We are pleased to inform you that your manuscript has been received for consideration in Adroid Publishing's journal.</p>
            <p>Your submission details are as follows:</p>
            <ul>
                <li><strong>Paper ID:</strong> ${paperID}</li>
                <li><strong>Paper Title:</strong> ${title}</li>
            </ul>
            <p>To proceed with the publishing process, kindly review and complete the publishing agreement form by clicking the link below:</p>
            <p style="margin-top: 20px;">
                Complete Your Publishing Agreement : 
                <a href="https://www.adroidjournals.com/publishingagreement/${jounralID}" 
                   style="color: #1a73e8; text-decoration: none; font-weight: bold;">
                    Publishing Agreement Link
                </a>
            </p>
            <p>Ensure that you carefully enter your details in the form to complete the submission of your publishing agreement with us.</p>
            <p>If you have any questions, feel free to reach out to us using the contact information below.</p>
            <div style="margin-top: 30px;">
                <p>Email: <a href="mailto:adroidjournal@gmail.com">adroidjournal@gmail.com</a></p>
            </div>
            <p>Best regards,</p>
            <p><strong>Adroid Publishing Team</strong></p>
        </div>
        `

    try {
        await sendEmail({
            to: email,
            subject: 'Adroid Publishing: Publishing Agreement Link',
            htmlContent,
            senderName: "Adroid Publishing Team",
            senderEmail: "adroidpublications@gmail;com"
        });
        res.status(200).json({ message: 'Email sent successfully' });
    } 
    catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send email' });
    }
};

import { sendEmail } from "../services/emailService.js";

export const sendQueryEmailForAdroidJournals = async (req, res) => {
    const { name, email, message } = req.body;

    // Validate the input data
    if (!name || !email || !message) {
        return res.status(400).json({ error: "Please provide name, email, and message" });
    }

    // Construct the email message
    const htmlContent = `
            <p>Hello Adroid Publishing Team,</p>
            <p>You have received a new query from a user:</p>
            <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Message:</strong> ${message}</li>
            </ul>
            <p>Please respond to this inquiry as soon as possible.</p>
            <p>Thank you.</p>
        `;

    try {
        await sendEmail({
            to: "adroidjournal@gmail.com",
            subject: "New Query",
            htmlContent,
            senderName: name,
        });
        console.log('Email sent successfully');
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send email' });
    }
};

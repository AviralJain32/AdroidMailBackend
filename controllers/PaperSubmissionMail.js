//deprecated file: controllers/PaperSubmissionMail.js

import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import moment from "moment"

// Load environment variables from .env file
dotenv.config();

// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API);

export const sendMailForConfirmation = async (req, res) => {
    const { journal,title, email,counter } = req.body;
    // console.log(counter);
    // console.log(journal);

    // Validate the input data
    if (!title || !email || !journal) {
        return res.status(400).json({ error: "Please provide title, email, and message" });
    }

    // Construct the email message
    const msg = {
        to: ['adroidjournal@gmail.com',`${email}`], // Change to your recipient
        from: {
            name:`Adroid Publishing`,
            email:`adroidjournal@gmail.com`
        }, // Change to your verified sender
        subject: 'Adroid Publishing: Your Paper Submission Details',
        html: `
        <div>
        <h1>Thank you for your submission</h1>
        <p>Thank you for your submission for consideration in the journal by Adroid Publishing.</p>
        <p>Your submission details are as follows:</p>
        <ul>
            <li><strong>Paper ID:</strong> ${journal}-${moment().format('YY')}-${counter}</li>
            <li><strong>Paper Title:</strong> ${title}</li>
        </ul>
        <p>Please use the Paper ID for any further communication with us.</p>
        <div>
            <p>Email ID: ${email}</p>
        </div>
        </div>
        `,
    };
    // console.log(journal,title, email,counter);

    try {
        // Send the email
        await sgMail.send(msg);
        res.status(200).json({ message: 'Email sent successfully' });
    } 
    catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send email' });
    }
};

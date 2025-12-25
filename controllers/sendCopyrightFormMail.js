
// import sgMail from '@sendgrid/mail';
// import fs from "fs"

// import dotenv from 'dotenv';
// dotenv.config();

// sgMail.setApiKey(process.env.SENDGRID_API);


// export const sendCopyrightFormEmail = async (req, res) => {
//     // Multer will parse the form-data and make the fields and files available
//     const { email, authorName, manuscriptTitle,journalEmail } = req.body; // Access form fields
//     const pdfFile = req.file; // Access uploaded file (single file)

//     if (!pdfFile) {
//         return res.status(400).json({ message: "No PDF file uploaded!" });
//     }

//     // Read the file and convert to base64 (to send via email)
//     const fileContent = fs.readFileSync(pdfFile.path).toString('base64');
//     const msg = {
//         to: [email, `${journalEmail}`],
//         from: "adroidpublications@gmail.com", // Replace with your SendGrid verified sender email
//         subject: `Signed Journal Publishing Agreement for "${manuscriptTitle}"`,
//         html: `
//             <div style="font-family: Arial, sans-serif; color: #333;">
//                 <h2 style="color: #4CAF50;">Dear ${authorName},</h2>
//                 <p>
//                     We are pleased to inform you that the signed <strong>Journal Publishing Agreement</strong> for your manuscript titled 
//                     "<em>${manuscriptTitle}</em>" has been successfully attached to this email.
//                 </p>
//                 <p>
//                     Please take a moment to review the attached document and ensure that everything is in order. We recommend keeping a copy for your records.
//                 </p>
//                 <p>
//                     If you have any questions, require clarification, or need further assistance, feel free to reach out to us. We are here to help.
//                 </p>
//                 <p style="margin-top: 30px;">
//                     Best regards,<br/>
//                     <strong>Adroid Publications Team</strong><br/>
//                     <a href="mailto:adroidpublications@gmail.com" style="color: #4CAF50;">adroidpublications@gmail.com</a>
//                 </p>
//                 <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
//                 <footer style="font-size: 12px; color: #999;">
//                     This email was sent to ${email} regarding your manuscript submission to Adroid Publications. If you believe this email was sent in error, please contact us immediately.
//                 </footer>
//             </div>
//         `,
//         attachments: [
//             {
//                 content: fileContent,
//                 filename: pdfFile.originalname,
//                 type: 'application/pdf',
//                 disposition: 'attachment'
//             }
//         ]
//     };

//     try {
//         await sgMail.send(msg);
//         // Delete file from server after sending
//         fs.unlinkSync(pdfFile.path);
//         res.status(200).json({ message: 'Email sent successfully!' });
//     } catch (error) {
//         fs.unlinkSync(pdfFile.path);
//         console.error("Error sending email:", error);
//         res.status(500).json({ message: 'Error sending email', error });
//     }
// };

import fs from "fs";
import { sendEmail } from "../services/emailService.js";

export const sendCopyrightFormEmail = async (req, res) => {
  const { email, authorName, manuscriptTitle, journalEmail } = req.body;
  const pdfFile = req.file;

  if (!pdfFile) {
    return res.status(400).json({
      message: "No PDF file uploaded!",
    });
  }

  try {
    // Read PDF and convert to base64
    const fileContent = fs.readFileSync(pdfFile.path).toString("base64");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50;">Dear ${authorName},</h2>

        <p>
          We are pleased to inform you that the signed
          <strong>Journal Publishing Agreement</strong> for your manuscript titled
          "<em>${manuscriptTitle}</em>" has been successfully attached to this email.
        </p>

        <p>
          Please take a moment to review the attached document and ensure that everything is in order.
          We recommend keeping a copy for your records.
        </p>

        <p>
          If you have any questions or require further assistance, feel free to contact us.
        </p>

        <p style="margin-top: 30px;">
          Best regards,<br/>
          <strong>Adroid Publications Team</strong><br/>
          <a href="mailto:adroidpublications@gmail.com">
            adroidpublications@gmail.com
          </a>
        </p>

        <hr />

        <footer style="font-size: 12px; color: #999;">
          This email was sent to ${email} regarding your manuscript submission.
        </footer>
      </div>
    `;

    await sendEmail({
      to: [
        { email },
        { email: journalEmail },
      ],
      subject: `Signed Journal Publishing Agreement for "${manuscriptTitle}"`,
      htmlContent,
      attachments: [
        {
          content: fileContent,
          name: pdfFile.originalname,
        },
      ],
    });

    // Cleanup file
    fs.unlinkSync(pdfFile.path);

    res.status(200).json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    if (fs.existsSync(pdfFile.path)) {
      fs.unlinkSync(pdfFile.path);
    }

    console.error("Email Error:", error);
    res.status(500).json({
      message: "Error sending email",
    });
  }
};

import moment from "moment";
import { sendEmail } from "../services/emailService.js";

/**
 * Handles sending a formatted email for Book Series quote requests
 */
export const sendBookQuotationMail = async (req, res) => {
  try {
    const {
      editors, // [{ name, affiliation, email, bio }]
      bookTitle,
      aboutBook,
      scope,
      chapters, // [{ title }]
      promotionPlan,
      targetAudience,
    } = req.body;

    // Basic validation
    if (
      !editors ||
      editors.length === 0 ||
      !bookTitle ||
      !aboutBook ||
      !scope ||
      !chapters ||
      chapters.length < 10
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required book proposal fields",
      });
    }

    // Quote reference
    const quoteRef = `BQUOTE-${moment().format("YYYYMMDD")}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    /* -------------------- HTML helpers -------------------- */

    const editorsHtml = editors
      .map(
        (ed, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${ed.name}</td>
          <td>${ed.affiliation}</td>
          <td>${ed.email}</td>
          <td>${ed.bio}</td>
        </tr>
      `
      )
      .join("");

    const chaptersHtml = chapters
      .map((ch, i) => `<li><strong>Chapter ${i + 1}:</strong> ${ch.title}</li>`)
      .join("");

    /* -------------------- ADMIN EMAIL -------------------- */

    const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          max-width: 700px;
          margin: auto;
        }
        .header {
          background: #3c8f3c;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
        }
        h2 {
          color: #3c8f3c;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          font-size: 13px;
          vertical-align: top;
        }
        th {
          background: #f5f5f5;
        }
        .quote-ref {
          background: #f8f9fa;
          padding: 10px;
          border-left: 4px solid #3c8f3c;
          margin-bottom: 20px;
          font-weight: bold;
        }
      </style>
    </head>

    <body>
      <div class="header">
        <h1>Adroid Publishing – Book Series Quote Request</h1>
      </div>

      <div class="content">
        <div class="quote-ref">Quote Reference: ${quoteRef}</div>

        <h2>Book Information</h2>
        <p><strong>Book Title:</strong> ${bookTitle}</p>
        <p><strong>About the Book:</strong><br/>${aboutBook}</p>
        <p><strong>Scope of Book:</strong><br/>${scope}</p>

        <h2>Book Editors</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Affiliation</th>
              <th>Email</th>
              <th>Brief Bio</th>
            </tr>
          </thead>
          <tbody>
            ${editorsHtml}
          </tbody>
        </table>

        <h2>Tentative Chapters</h2>
        <ul>
          ${chaptersHtml}
        </ul>

        <h2>Marketing & Audience</h2>
        <p><strong>Promotion Plan:</strong><br/>${promotionPlan}</p>
        <p><strong>Who will purchase this book:</strong><br/>${targetAudience}</p>

        <p style="margin-top:20px;">
          Submitted on ${moment().format("MMMM Do YYYY, h:mm:ss a")}
        </p>
      </div>
    </body>
    </html>
    `;

    /* -------------------- EDITOR CONFIRMATION EMAIL -------------------- */

    const primaryEditor = editors[0];

    const editorEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          max-width: 600px;
          margin: auto;
        }
        .header {
          background: #3c8f3c;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
        }
        .quote-ref {
          background: #f8f9fa;
          padding: 10px;
          border-left: 4px solid #3c8f3c;
          margin: 15px 0;
          font-weight: bold;
        }
      </style>
    </head>

    <body>
      <div class="header">
        <h1>Adroid Publishing</h1>
        <p>Book Proposal Submission Confirmation</p>
      </div>

      <div class="content">
        <p>Dear ${primaryEditor.name},</p>

        <p>
          Thank you for submitting your book proposal titled 
          <strong>"${bookTitle}"</strong> to Adroid Publishing.
        </p>

        <div class="quote-ref">
          Your Book Quote Reference: ${quoteRef}
        </div>

        <p>
          Our editorial team will carefully review your proposal and
          contact you within <strong>1–2 weeks</strong> with further details
          regarding the quotation and next steps.
        </p>

        <p>
          If you have any queries, please email us at
          <a href="mailto:adroidpublications@gmail.com">
            adroidpublications@gmail.com
          </a>
          and mention your reference number.
        </p>

        <p>Warm regards,<br/>
        <strong>Adroid Publishing Team</strong></p>
      </div>
    </body>
    </html>
    `;

    /* -------------------- SEND EMAILS -------------------- */

    await Promise.all([
      // Admin
      sendEmail({
        to: "adroidpublications@gmail.com",
        subject: `Book Series Quote Request: ${bookTitle} [${quoteRef}]`,
        htmlContent: adminEmailHtml,
        senderName: "Adroid Publishing",
        senderEmail: "adroidjournal@gmail.com",
      }),

      // Primary Editor
      sendEmail({
        to: primaryEditor.email,
        subject: `Your Book Proposal Submission – ${quoteRef}`,
        htmlContent: editorEmailHtml,
        senderName: "Adroid Publishing",
        senderEmail: "adroidjournal@gmail.com",
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Book proposal submitted successfully",
      quoteRef,
    });

  } catch (error) {
    console.error("Book quotation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process book quotation request",
    });
  }
};

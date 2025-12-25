import { transactionalEmailApi } from "../config/brevo.js";

export const sendEmail = async ({
  to,
  subject,
  htmlContent,
  senderName = "Android Journals",
  senderEmail = "adroidjournal@gmail.com",
  attachments=[]
}) => {
  try {
    const email = {
      to: Array.isArray(to) ? to : [{ email: to }],
      sender: {
        name: senderName,
        email: senderEmail,
      },
      attachments,
      subject,
      htmlContent,
    };

    await transactionalEmailApi.sendTransacEmail(email);
    return true;
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};

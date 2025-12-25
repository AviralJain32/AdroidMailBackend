
import moment from "moment";
import { sendEmail } from "../services/emailService.js";

/**
 * Handles sending a formatted email for conference quote requests
 */
export const sendQuotationMail = async (req, res) => {
    try {
        // Extract all form data from request body
        const {
            // Organizer details
            organiserTitle,
            organiserFirstName,
            organiserLastName,
            organiserEmail,
            organiserAffiliation,
            organiserExperience,
            organiserCountry,
            
            // Editor details
            editorTitle,
            editorFirstName,
            editorLastName,
            editorAffiliation,
            editorCountry,
            
            // Conference details
            conferenceTitle,
            abbreviatedTitle,
            subject,
            otherSubject,
            journal,
            conferenceWebsite,
            startDate,
            endDate,
            venueAddress,
            
            // Conference estimates
            articlesCount,
            participantsCount,
            furtherInfo,
            
            // Services
            abstractManagement,
            peerReviewManagement,
            onlineHosting,
            
            // Additional info
            howDidYouHear,
            marketingConsent
        } = req.body;

        // Validate required fields
        const requiredFields = [
            'organiserFirstName', 
            'organiserLastName', 
            'organiserEmail',
            'organiserAffiliation',
            'editorFirstName',
            'editorLastName',
            'editorAffiliation',
            'conferenceTitle',
            'abbreviatedTitle',
            'journal',
            'articlesCount',
            'participantsCount'
        ];
        
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                error: "Missing required fields", 
                fields: missingFields 
            });
        }

        // Generate a unique quote reference number
        const quoteRef = `AQUOTE-${moment().format('YYYYMMDD')}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        // Format dates nicely if they exist
        const formattedStartDate = startDate ? moment(startDate).format('MMMM Do, YYYY') : 'Not specified';
        const formattedEndDate = endDate ? moment(endDate).format('MMMM Do, YYYY') : 'Not specified';
        
        // Build beautiful HTML email template
        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .header {
                    background-color: #3c8f3c;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 5px 5px 0 0;
                }
                .footer {
                    background-color: #f5f5f5;
                    padding: 15px;
                    text-align: center;
                    border-radius: 0 0 5px 5px;
                    font-size: 12px;
                    color: #666;
                }
                .content {
                    padding: 20px;
                    background-color: #fff;
                    border: 1px solid #ddd;
                }
                .section {
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #eee;
                }
                .section h2 {
                    color: #3c8f3c;
                    font-size: 18px;
                    margin-bottom: 10px;
                }
                .field {
                    margin-bottom: 8px;
                }
                .label {
                    font-weight: bold;
                    color: #555;
                }
                .value {
                    margin-left: 5px;
                }
                .quote-ref {
                    background-color: #f8f9fa;
                    padding: 10px;
                    border-left: 4px solid #3c8f3c;
                    margin: 15px 0;
                    font-weight: bold;
                }
                .services-list {
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Adroid Publishing Conference Quote Request</h1>
                <p>A new conference quote request has been submitted</p>
            </div>
            
            <div class="content">
                <div class="quote-ref">
                    Quote Reference: ${quoteRef}
                </div>
                
                <div class="section">
                    <h2>Conference Organizer Details</h2>
                    <div class="field">
                        <span class="label">Name:</span>
                        <span class="value">${organiserTitle || ''} ${organiserFirstName} ${organiserLastName}</span>
                    </div>
                    <div class="field">
                        <span class="label">Email:</span>
                        <span class="value">${organiserEmail}</span>
                    </div>
                    <div class="field">
                        <span class="label">Affiliation:</span>
                        <span class="value">${organiserAffiliation}</span>
                    </div>
                    <div class="field">
                        <span class="label">Country:</span>
                        <span class="value">${organiserCountry}</span>
                    </div>
                    ${organiserExperience ? `
                    <div class="field">
                        <span class="label">Previous Experience:</span>
                        <span class="value">${organiserExperience}</span>
                    </div>` : ''}
                </div>
                
                <div class="section">
                    <h2>Guest Editor Details</h2>
                    <div class="field">
                        <span class="label">Name:</span>
                        <span class="value">${editorTitle || ''} ${editorFirstName} ${editorLastName}</span>
                    </div>
                    <div class="field">
                        <span class="label">Affiliation:</span>
                        <span class="value">${editorAffiliation}</span>
                    </div>
                    <div class="field">
                        <span class="label">Country:</span>
                        <span class="value">${editorCountry}</span>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Conference Details</h2>
                    <div class="field">
                        <span class="label">Conference Title:</span>
                        <span class="value">${conferenceTitle}</span>
                    </div>
                    <div class="field">
                        <span class="label">Abbreviated Title:</span>
                        <span class="value">${abbreviatedTitle}</span>
                    </div>
                    <div class="field">
                        <span class="label">Subject:</span>
                        <span class="value">${subject}${subject === 'Other' ? ` - ${otherSubject}` : ''}</span>
                    </div>
                    <div class="field">
                        <span class="label">Journal:</span>
                        <span class="value">${journal}</span>
                    </div>
                    ${conferenceWebsite ? `
                    <div class="field">
                        <span class="label">Website:</span>
                        <span class="value"><a href="${conferenceWebsite}">${conferenceWebsite}</a></span>
                    </div>` : ''}
                    <div class="field">
                        <span class="label">Dates:</span>
                        <span class="value">${formattedStartDate} to ${formattedEndDate}</span>
                    </div>
                    <div class="field">
                        <span class="label">Venue/Location:</span>
                        <span class="value">${venueAddress}</span>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Conference Estimates</h2>
                    <div class="field">
                        <span class="label">Number of Articles:</span>
                        <span class="value">${articlesCount}</span>
                    </div>
                    <div class="field">
                        <span class="label">Expected Participants:</span>
                        <span class="value">${participantsCount}</span>
                    </div>
                    <div class="field">
                        <span class="label">Additional Information:</span>
                        <div style="margin-top: 10px; white-space: pre-line;">${furtherInfo}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Requested Services</h2>
                    <div class="services-list">

                        <div class="field">
                            <span class="label">Call for papers and Peer Review Management:</span>
                            <span class="value">${peerReviewManagement ? 'Yes' : 'No'}</span>
                        </div>
                        <div class="field">
                            <span class="label">Online Event Hosting:</span>
                            <span class="value">${onlineHosting ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Additional Information</h2>
                    <div class="field">
                        <span class="label">How they heard about us:</span>
                        <span class="value">${howDidYouHear}</span>
                    </div>
                    <div class="field">
                        <span class="label">Marketing Consent:</span>
                        <span class="value">${marketingConsent ? 'Yes' : 'No'}</span>
                    </div>
                </div>
                
                <p>This request was submitted on ${moment().format('MMMM Do YYYY, h:mm:ss a')}.</p>
            </div>
            
            <div class="footer">
                <p>© ${moment().format('YYYY')} Adroid Publishing. All rights reserved.</p>
                <p>Please handle this information in accordance with your privacy policy.</p>
            </div>
        </body>
        </html>
        `;

        // Prepare confirmation email to the organizer
        const organizerEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .header {
                    background-color: #3c8f3c;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 5px 5px 0 0;
                }
                .footer {
                    background-color: #f5f5f5;
                    padding: 15px;
                    text-align: center;
                    border-radius: 0 0 5px 5px;
                    font-size: 12px;
                    color: #666;
                }
                .content {
                    padding: 20px;
                    background-color: #fff;
                    border: 1px solid #ddd;
                }
                .quote-ref {
                    background-color: #f8f9fa;
                    padding: 10px;
                    border-left: 4px solid #3c8f3c;
                    margin: 15px 0;
                    font-weight: bold;
                }
                .info-box {
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 15px 0;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Adroid Publishing</h1>
                <p>Conference Quote Request Confirmation</p>
            </div>
            
            <div class="content">
                <p>Dear ${organiserTitle || ''} ${organiserFirstName} ${organiserLastName},</p>
                
                <p>Thank you for submitting your conference quote request for "${conferenceTitle}". We have received your request and are processing it.</p>
                
                <div class="quote-ref">
                    Your Quote Reference: ${quoteRef}
                </div>
                
                <p>Please keep this reference number for future communications regarding your quote request.</p>
                
                <div class="info-box">
                    <p><strong>What happens next?</strong></p>
                    <p>Our team will review your request and get back to you within 1-2 weeks with a detailed quotation.</p>
                    <p>If we need any additional information, we will contact you at ${organiserEmail}.</p>
                </div>
                
                <p>If you have any questions in the meantime, please don't hesitate to contact us at <a href="mailto:support@Adroidpublishing.com">adroidpublications@gmail.com</a> with your quote reference number.</p>
                
                <p>Best regards,</p>
                <p>The Adroid Publishing Team</p>
            </div>
            
            <div class="footer">
                <p>© ${moment().format('YYYY')} Adroid Publishing. All rights reserved.</p>
                ${marketingConsent ? '<p>You have opted to receive marketing communications from us. You can unsubscribe at any time.</p>' : ''}
            </div>
        </body>
        </html>
        `;

        // Send both emails in parallel
        await Promise.all([
        // Admin email
        sendEmail({
            to: "adroidpublications@gmail.com",
            subject: `Conference Quote Request: ${conferenceTitle} [${quoteRef}]`,
            htmlContent: emailHtml,
            senderName: "Adroid Publishing",
            senderEmail: "adroidjournal@gmail.com",
        }),

        // Organizer confirmation email
        sendEmail({
            to: organiserEmail,
            subject: `Your Conference Quote Request - ${quoteRef}`,
            htmlContent: organizerEmailHtml,
            senderName: "Adroid Publishing",
            senderEmail: "adroidjournal@gmail.com",
        }),
        ]);

        console.log("success");
        console.log(organiserEmail);

        // Return success response
        return res.status(200).json({
        success: true,
        message: "Quote request submitted successfully",
        quoteRef: quoteRef,
        });

    } catch (error) {
        console.log("failure")
        console.error('Error processing quote request:', error);
        
        // Return error response
        return res.status(500).json({
            success: false,
            error: 'Failed to process quote request',
            message: error.message || 'An unexpected error occurred'
        });
    }
};
// done
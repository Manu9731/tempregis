import nodemailer from "nodemailer";

/**
 * Sends an email notification about test execution.
 *
 * @param {string} fromEmail - Sender's email address.
 * @param {string} password - Sender's email password or app password.
 * @param {string} toEmail - Recipient's email address.
 * @param {object} res - Response object for handling errors in an API context.
 */
async function sendEmail(appId, testSuite, env, fromEmail, password, toEmail, res, options = {attachments : []}) {
  try {
    // Configure the email transporter using Gmail service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: fromEmail,
        pass: password,
      },
    });

    // Define email content (HTML format)
    const mailOptions = {
      from: `"Email Notification" <${fromEmail}>`, // Sender's email with a display name
      to: toEmail, // Recipient's email
      subject: `Your Application Details Registered Successfully with Paavana Test Automation Framework Suite with Application Id ${appId}`, // Email subject
      html: `
       <p>Hi Team,</p>

      <p>Your Application Details have been Registered Successfully with Paavana Test Automation Framework Suite.</p>

      <p>Your Application Registration is successful with Paavana Test Automation Framework Suite with Application Id <b>${appId}</b></p>

      <p>Details are given below:</p>

      <ul>
          <li>
              <b>Test Suite: </b>${testSuite}
          </li>
          <li>
              <b>Environment: </b>${env}
          </li>
          <li>
              <b>Triggered By: </b> Paavana Test Automation Framework
          </li>
      </ul>

      <p>Environment Details to be given in Attachment in .pdf format></p>

      <hr/>

      <p>You will receive an update once the execution is started.</p>

      <p>Thanks, <br>Paavana Team</p>

      `,
      attachments: options.attachments||[],
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email successfully sent:", info.messageId);
  } catch (error) {
    // Handle errors and respond with status 404
    console.error("❌ Error sending email:", error.message);
    res.status(404).send(error.message);
    throw new Error(error.message);
  }
}

export default sendEmail;

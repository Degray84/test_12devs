const nodemailer = require("nodemailer");
const toLocalDate = require("./toLocaleDate");
module.exports = async (pdfBuffer) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "779f8b6e0b146f",
      pass: "0165a6b66262f2",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let info = await transporter.sendMail({
    from: "testUser@mailtrap.io",
    to: "test-nyev3t6k8@srv1.mail-tester.com",
    subject: "New invoice",
    html: `
    <b>Hello!</b>
    <p>It was pleasure to work with you and your team. Please let me know if you have any questions and we hope you will keep us in mind for future freelance projects.</p>
    <b> Thank you!</b>
    `,
    attachments: [{ filename: `Invoice for ${toLocalDate(new Date(), "2-digit")}.pdf`, content: pdfBuffer }],
  });
  return info;
};

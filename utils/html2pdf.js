const html_to_pdf = require("html-pdf-node");
// const { dirname, resolve } = require("path");
const mainTemplateForPDF = require("./templates/mainTemplateForPDF");
module.exports = async (invoice) => {
  let options = { format: "A4", printBackground: true };
  const pdf = mainTemplateForPDF(invoice);
  let file = { content: pdf };
  const pdfBuffer = await html_to_pdf.generatePdf(file, options);
  return pdfBuffer;
};

const html_to_pdf = require("html-pdf-node");
const { dirname, resolve } = require("path");
const generateTemplateForPDF = require("./templates/mainTemplateForPDF");
module.exports = async (invoice) => {
  let options = { format: "A4", path: resolve(dirname(require.main.filename), "pdf", "example.pdf"), printBackground: true };
  const pdf = generateTemplateForPDF(invoice);
  let file = { content: pdf };
  const pdfBuffer = await html_to_pdf.generatePdf(file, options);
  return pdfBuffer;
};

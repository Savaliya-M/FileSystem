const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  pdfData: Buffer,
  name: String,
});

const PDFModel = mongoose.model("PDF", pdfSchema);
module.exports = PDFModel;

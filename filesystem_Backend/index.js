const express = require("express");
const multer = require("multer");
const fs = require("fs-extra");
const PDFParser = require("pdf-parse");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const PDFModel = require("./pdfmodel");

const app = express();
const port = 4000;
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect("mongodb://127.0.0.1:27017/FileUpload", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("pdf"), async (req, res) => {
  const newPDF = new PDFModel({
    pdfData: req.file.buffer,
    name: req.file.originalname,
  });

  try {
    await newPDF.save();
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while saving the PDF" });
  }
});

app.get("/list", async (req, res) => {
  try {
    const files = await fs.readdir("uploads");

    res.status(200).json(files);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while listing PDF files" });
  }
});

app.delete("/delete/:filename", async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  try {
    const exists = await fs.pathExists(filePath);

    if (!exists) {
      return res.status(404).json({ error: "File not found" });
    }

    await fs.unlink(filePath);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the file" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const axios = require("axios");
const officeParser = require("officeparser");
const multer = require("multer");
const path = require("path");

// Set up multer storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // You can adjust the folder to store your files
    cb(null, "controllers/uploads/");
  },
  filename: function (req, file, cb) {
    // Naming the file with its original name
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize multer upload
const upload = multer({ storage: storage });

// Define the route that handles the file upload and parsing
const getContentFromDoc = async (req, res) => {
  // Check if file is uploaded
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    // Get the file path
    const filePath = path.join(__dirname, "uploads", req.file.filename);
    console.log(filePath);
    // Use officeparser to parse the document
    officeParser.parseOffice(filePath, function (data, err) {
      // "data" string in the callback here is the text parsed from the office file passed in the first argument above
      if (err) {
        console.log(err);
        return;
      }
      console.log(data);
      res.status(200).json(data);
    });

    // Return the parsed content in the response
  } catch (error) {
    console.error("Error parsing the file:", error);
    res.status(500).json({ message: "Error parsing the file." });
  }
};

module.exports = { getContentFromDoc, upload };

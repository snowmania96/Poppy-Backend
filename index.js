const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

const boardRoutes = require("./routes/board");

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/board", boardRoutes);

app.get("/user", (req, res) => {
  res.send("Got a POST request");
});

app.listen(PORT, () => console.log(`Server is running on Port: http://localhost:${PORT}`));

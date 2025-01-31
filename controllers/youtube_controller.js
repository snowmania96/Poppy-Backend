const axios = require("axios");
const { text } = require("body-parser");
const cheerio = require("cheerio");

const getYoutubeTranscriptFromUrl = async (req, res) => {
  try {
    const { url } = req.body;
    console.log(url);

    const response = await axios.post(
      `https://api.apify.com/v2/acts/invideoiq~video-transcript-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_API_KEY}`,
      {
        video_url: url,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    script = response.data[0].text;
    if (!script) {
      res.status(404).send("Failed to convert");
    }
    res.status(200).json(script);
  } catch (err) {
    console.error("Error fetching script:", err.message);
    res.status(500).send("An error occurred while fetching the script");
  }
};

module.exports = { getYoutubeTranscriptFromUrl };

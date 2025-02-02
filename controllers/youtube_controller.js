const axios = require("axios");
const { text } = require("body-parser");
const cheerio = require("cheerio");

const getYoutubeTranscriptFromUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).send("URL is required");

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
      console.log("Failed to fetch script");
    }
    res.status(200).json(script);
  } catch (err) {
    console.error("Error fetching script:", err.message);
    res.status(500).send("An error occurred while fetching the script");
  }
};

module.exports = { getYoutubeTranscriptFromUrl };

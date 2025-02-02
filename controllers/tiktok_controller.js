const axios = require("axios");

const getTikTokThumbnailUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).send("URL is required");

    const validUrl = /https:\/\/www\.tiktok\.com\/@.+\/video\/\d+/;
    if (!validUrl.test(url)) {
      return res.status(400).send("Invalid TikTok URL format");
    }

    const response = await fetch(`https://www.tiktok.com/oembed?url=${url}`);

    if (!response.ok) {
      throw new Error(`Error fetching metadata: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract the thumbnail URL from the response
    const thumbnailUrl = data.thumbnail_url;
    res.status(200).json(thumbnailUrl);
  } catch (err) {
    console.error("Error fetching TikTok thumbnail:", err.message);
    res.status(500).send("An error occurred while fetching the thumbnail");
  }
};

const getTikTokTranscriptFromUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).send("URL is required");

    const validUrl = /https:\/\/www\.tiktok\.com\/@.+\/video\/\d+/;
    if (!validUrl.test(url)) {
      return res.status(400).send("Invalid TikTok URL format");
    }

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

    const script = response.data[0]?.text;
    if (!script) {
      console.log("Failed to fetch script");
    }
    res.status(200).json(script);
  } catch (err) {
    console.error("Error fetching from API:", err.message);
    res.status(500).send("An error occurred while fetching");
  }
};

module.exports = { getTikTokThumbnailUrl, getTikTokTranscriptFromUrl };

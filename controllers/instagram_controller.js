const axios = require("axios");
const cheerio = require("cheerio");
const { convertVideoToAudioAndTranscribe } = require("../utils/video-converter.js");

const getInstagramThumbnailUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).send("URL is required");

    // Validate the URL format
    const validUrl = /^(http|https):\/\/[^ "]+$/.test(url);
    if (!validUrl) {
      return res.status(400).send("Invalid URL format");
    }

    // Fetch the HTML content of the page
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    // Extract the main og:image content
    const imageUrl = $('meta[property="og:image"]').attr("content");

    // Sometimes, Instagram provides additional data or images without overlays
    const alternateUrl = $('meta[name="twitter:image"]').attr("content");

    if (alternateUrl) {
      console.log("Alternate Image URL:", alternateUrl);
      res.status(200).json(alternateUrl);
    } else if (imageUrl) {
      console.log("Image URL with overlay:", imageUrl);
      res.status(200).json(imageUrl);
    } else {
      console.log("No suitable image found.");
      res.status(404).send("No suitable image found.");
    }
  } catch (err) {
    console.log("Fail to get thumbnailUrl");
    res.status(500).send("Fail to get thumbnailUrl: ", err);
  }
};

const getInstagramTranscriptFromUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).send("URL is required");

    const response = await axios.post(
      `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_API_KEY}`,
      {
        addParentData: false,
        directUrls: [url],
        enhanceUserSearchWithFacebookPage: false,
        isUserReelFeedURL: false,
        isUserTaggedFeedURL: false,
        resultsLimit: 200,
        resultsType: "posts",
        searchLimit: 1,
        searchType: "hashtag",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const videoUrl = response.data[0]?.videoUrl;
    if (!videoUrl) {
      console.log("Video Not Found");
      res.status(404).send("Video Not Found");
    }
    const script = await convertVideoToAudioAndTranscribe(videoUrl);
    res.status(200).json(script);
  } catch (err) {
    console.error("Error fetching script:", err.message);
    res.status(500).send("An error occurred while fetching the script");
  }
};

module.exports = { getInstagramThumbnailUrl, getInstagramTranscriptFromUrl };

const axios = require("axios");
const cheerio = require("cheerio");
const { convertVideoToAudioAndTranscribe } = require("../utils/video-converter.js");

const getFacebookThumbnailUrl = async (req, res) => {
  try {
    const { url } = req.body;

    console.log(url);

    const response = await axios.post(
      `https://api.apify.com/v2/acts/apify~facebook-ads-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_API_KEY}`,

      {
        isDetailsPerAd: true,
        onlyTotal: false,
        resultsLimit: 99999,
        startUrls: [
          {
            url: url,
            method: "GET",
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const imageUrl = response.data[0]?.snapshot?.videos[0]?.video_preview_image_url;
    res.status(200).json(imageUrl);
  } catch (err) {
    console.log(err);
  }
};

const getFacebookTranscriptFromUrl = async (req, res) => {
  try {
    const { url } = req.body;
    console.log(url);

    const response = await axios.post(
      `https://api.apify.com/v2/acts/apify~facebook-ads-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_API_KEY}`,

      {
        isDetailsPerAd: true,
        onlyTotal: false,
        resultsLimit: 99999,
        startUrls: [
          {
            url: url,
            method: "GET",
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const videoUrl = response.data[0].snapshot.videos[0].video_sd_url;
    if (!!videoUrl) {
      const script = await convertVideoToAudioAndTranscribe(videoUrl);
      res.status(200).json(script);
    } else {
      res.status(404).send("Image Not Found");
    }
  } catch (err) {
    console.error("Error fetching script:", err.message);
    res.status(500).send("An error occurred while fetching the script");
  }
};

module.exports = { getFacebookThumbnailUrl, getFacebookTranscriptFromUrl };

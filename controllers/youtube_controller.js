const axios = require("axios");
const cheerio = require("cheerio");

const getYoutubeThumbnailUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).send("URL is required");

    console.log("Received URL:", url);

    // Validate the URL format
    const validUrl = /^(http|https):\/\/[^ "]+$/.test(url);
    if (!validUrl) {
      return res.status(400).send("Invalid URL format");
    }

    // Fetch the HTML content of the page
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    // Extract the thumbnail URL from Open Graph metadata
    const thumbnailUrl = $('meta[property="og:image"]').attr("content");

    if (thumbnailUrl) {
      console.log("Thumbnail URL:", thumbnailUrl);
      return res.status(200).json(thumbnailUrl);
    } else {
      console.log("No thumbnail found.");
      return res.status(404).send("Thumbnail not found");
    }
  } catch (err) {
    console.error("Error fetching thumbnail:", err.message);
    return res.status(500).send("An error occurred");
  }
};

const getYoutubeTranscriptFromUrl = async (req, res) => {
  try {
    const { url } = req.body;
    console.log(url);
    // axios.interceptors.request.use((request) => {
    //   console.log("Starting Request", JSON.stringify(request, null, 2));
    //   return request;
    // });
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
    res.status(200).json(response.data[0].text);
  } catch (err) {
    console.error("Error fetching script:", err.message);
    res.status(500).send("An error occurred while fetching the script");
  }
};

module.exports = { getYoutubeThumbnailUrl, getYoutubeTranscriptFromUrl };

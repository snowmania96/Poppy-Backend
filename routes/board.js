const express = require("express");
const { getScreenShot } = require("../controllers/website_controller");
const {
  getInstagramThumbnailUrl,
  getInstagramTranscriptFromUrl,
} = require("../controllers/instagram_controller");
const {
  getYoutubeThumbnailUrl,
  getYoutubeTranscriptFromUrl,
} = require("../controllers/youtube_controller");
const {
  getTikTokThumbnailUrl,
  getTikTokTranscriptFromUrl,
} = require("../controllers/tiktok_controller");
const {
  getFacebookThumbnailUrl,
  getFacebookTranscriptFromUrl,
} = require("../controllers/facebook_controllers");

const router = express.Router();

router.post("/website", getScreenShot);
router.post("/instagram", getInstagramThumbnailUrl);
router.post("/youtube", getYoutubeThumbnailUrl);
router.post("/tiktok", getTikTokThumbnailUrl);
router.post("/facebook", getFacebookThumbnailUrl);

router.post("/instagram/script", getInstagramTranscriptFromUrl);
router.post("/youtube/script", getYoutubeTranscriptFromUrl);
router.post("/tiktok/script", getTikTokTranscriptFromUrl);
router.post("/facebook/script", getFacebookTranscriptFromUrl);

module.exports = router;

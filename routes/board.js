const express = require("express");
const { getScreenShot } = require("../controllers/website_controller");
const {
  getInstagramThumbnailUrl,
  getInstagramTranscriptFromUrl,
} = require("../controllers/instagram_controller");
const { getYoutubeTranscriptFromUrl } = require("../controllers/youtube_controller");
const {
  getTikTokThumbnailUrl,
  getTikTokTranscriptFromUrl,
} = require("../controllers/tiktok_controller");
const { getFacebookInfo } = require("../controllers/facebook_controller");
const { getTitleFromScript } = require("../controllers/script_title_controller");
const { getTitleFromImage } = require("../controllers/image_controller");
const { answerTheQueation } = require("../controllers/aiChat_controller");
const { getContentFromDoc, upload } = require("../controllers/document_controller");

const router = express.Router();

router.post("/website", getScreenShot);
router.post("/instagram", getInstagramThumbnailUrl);

router.post("/tiktok", getTikTokThumbnailUrl);
router.post("/facebook", getFacebookInfo);

router.post("/instagram/script", getInstagramTranscriptFromUrl);
router.post("/youtube/script", getYoutubeTranscriptFromUrl);
router.post("/tiktok/script", getTikTokTranscriptFromUrl);

router.post("/title", getTitleFromScript);
router.post("/image", getTitleFromImage);
router.post("/chat", answerTheQueation);
router.post("/document", upload.single("file"), getContentFromDoc);

// router.post("/facebook/script", getFacebookTranscriptFromUrl);

module.exports = router;

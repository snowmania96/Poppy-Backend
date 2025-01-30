const puppeteer = require("puppeteer");

const getScreenShot = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).send("URL is required");
    console.log(url);

    const validUrl = /^(http|https):\/\/[^ "]+$/.test(url);
    if (!validUrl) {
      return res.status(400).send("Invalid URL format");
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set the viewport size for the screenshot
    await page.setViewport({ width: 1280, height: 720 });

    // Navigate to the target URL
    await page.goto(url, { waitUntil: "networkidle2" });

    // Take the screenshot as a buffer
    const screenshot = await page.screenshot();
    await browser.close();

    const base64Image = `data:image/png;base64,${Buffer.from(screenshot).toString("base64")}`;

    res.status(200).json({ image: base64Image });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getScreenShot };

const axios = require("axios");
const Buffer = require("buffer");

const getTitleFromImage = async (req, res) => {
  const imageUrl = req.body?.imageUrl;
  if (!imageUrl) {
    res.status(404).send("ImageUrl not found");
  }
  console.log(imageUrl);

  const getBase64FromBlob = (blob) => {
    return new Promise((resolve, reject) => {
      if (Buffer.isBuffer(blob)) {
        // If the blob is already a Buffer (binary data), convert it to base64
        resolve(blob.toString("base64"));
      } else {
        // If blob is a file path, read it and convert to base64
        fs.readFile(blob, (err, data) => {
          if (err) reject(err);
          resolve(data.toString("base64"));
        });
      }
    });
  };

  try {
    const imageForOpenAI = await getBase64FromBlob(imageUrl);
    console.log(imageForOpenAI);
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please give me a title for this image.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageForOpenAI,
                },
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    console.log(response.data);
    const title = response.data?.choices?.[0]?.message?.content?.slice(1, -1);
    if (!title) {
      console.log("Failed to fetch title");
    }

    res.status(200).json(title);
  } catch (error) {
    console.error("Error fetching title:", error.message);
    res.status(500).send("An error occurred while fetching the title");
  }
};

module.exports = { getTitleFromImage };

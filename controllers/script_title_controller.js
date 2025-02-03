const axios = require("axios");

const getTitleFromScript = async (req, res) => {
  const script = req.body?.script;
  if (!script) return res.status(404).send("Script not found");
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: "You extract email addresses into JSON data.",
          },
          {
            role: "user",
            content: `Here's a script. '${script}'  Please give me a short title for this script.`,
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

module.exports = { getTitleFromScript };

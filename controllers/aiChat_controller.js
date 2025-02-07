const axios = require("axios");

const answerTheQueation = async (req, res) => {
  const content = JSON.parse(req.body.content);
  console.log(content);
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "developer",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: `${req.body.content}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Send GPT-4's response back to the client
    const botMessage = response.data.choices[0].message.content;
    res.status(200).json(botMessage);
  } catch (error) {
    console.error("Error contacting GPT-4 API:", error);
  }
};

module.exports = { answerTheQueation };

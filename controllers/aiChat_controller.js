const axios = require("axios");

const answerTheQueation = async (req, res) => {
  console.log("req: ", req.body);
  const content = JSON.parse(req.body.content);
  console.log("content:", content);
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant. This is AI chatbox using GPT, and this is linked with several nodes about which user discuss with you. Please help user.",
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
        // responseType: "stream",
      }
    );

    // // Stream the response back to the client as it comes in
    // response.data.on("data", (chunk) => {
    //   const str = chunk.toString("utf8");
    //   // Extract the content part of the response
    //   try {
    //     const message = JSON.parse(str).choices[0].delta?.content;
    //     if (message) {
    //       console.log("part of msg: ", message);
    //       res.write(message); // Send part of the message to the client as it's received
    //     }
    //   } catch (err) {
    //     console.error("Error parsing chunk:", err);
    //   }
    // });

    // // End the response when the stream is done
    // response.data.on("end", () => {
    //   res.end();
    // });

    // Send GPT-4's response back to the client
    const botMessage = response.data.choices[0].message.content;
    res.status(200).json(botMessage);
  } catch (error) {
    console.error("Error contacting GPT-4 API:", error);
    res.status(500).json({ error: "Failed to contact GPT-4 API" });
  }
};

module.exports = { answerTheQueation };

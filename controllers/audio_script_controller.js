const getScriptAndTitleFromAudio = async (req, res) => {
  try {
    const formData = new FormData();
    const blob = req.body.audioUrl;
    console.log(blob);
    formData.append("file", blob, "audio.mp3");
    console.log(formData);
    formData.append("model", "whisper-1");

    const openAiResponse1 = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    const script = openAiResponse1.data.text;

    const openAiResponse2 = await axios.post(
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
    const title = openAiResponse2.data?.choices?.[0]?.message?.content?.slice(1, -1);
    res.status(200).json({ script, title });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { getScriptAndTitleFromAudio };

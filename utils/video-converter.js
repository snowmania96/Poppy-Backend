const ffmpeg = require("fluent-ffmpeg");
const streamBuffers = require("stream-buffers");
const axios = require("axios");
const FormData = require("form-data");

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");

const convertVideoToAudioAndTranscribe = async (videoUrl) => {
  try {
    // Create a writable buffer stream to hold the audio data
    const bufferStream = new streamBuffers.WritableStreamBuffer();
    // console.log(videoUrl);
    // Start FFmpeg conversion
    await new Promise((resolve, reject) => {
      ffmpeg(videoUrl)
        .toFormat("mp3") // Specify the desired audio format
        .on("start", (commandLine) => {
          console.log("FFmpeg process started:", commandLine);
        })
        .on("progress", (progress) => {
          console.log(`Processing: ${progress.percent}% done`);
        })
        .on("end", () => {
          console.log("Conversion finished!");
          resolve();
        })
        .on("error", (err) => {
          console.error("Error during conversion:", err.message);
          reject(err);
        })
        .pipe(bufferStream, { end: true }); // Pipe audio data directly to the buffer
    });

    // Get the buffer containing the audio data
    const audioBuffer = bufferStream.getContents();
    if (!audioBuffer) {
      throw new Error("Failed to convert video to audio buffer.");
    }

    console.log("audioBuffer :", audioBuffer);
    // Send the buffer to OpenAI's Whisper API
    const formData = new FormData();
    formData.append("file", audioBuffer, {
      filename: "audio.mp3", // Provide a filename
      contentType: "audio/mpeg", // Set MIME type
    });
    formData.append("model", "whisper-1"); // Specify Whisper model

    const openAiResponse = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    return openAiResponse.data.text;
  } catch (error) {
    console.error("Error during conversion and transcription:", error.message);
  }
};

module.exports = { convertVideoToAudioAndTranscribe };

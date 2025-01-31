const convertAudioToTranscribe = async (req, res) => {
  try {
    res.status(200).send("succeed");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = convertAudioToTranscribe;

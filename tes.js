const ytdl = require("@distube/ytdl-core");

/**
 * Function to get streamable or downloadable links for a YouTube video.
 * @param {string} videoUrl - The URL of the YouTube video.
 * @returns {Promise<{videoUrl: string, audioUrl: string}>} - An object containing video and audio download URLs.
 */
async function getDownloadLinks(videoUrl) {
  // Validate YouTube URL
  const videoID = extractVideoID(videoUrl);
  if (!videoID) {
    throw new Error("Invalid YouTube URL");
  }

  try {
    const videoInfo = await ytdl.getInfo(videoID);
    
    // Choose the best video and audio formats
    const videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: "highestvideo" });
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, { quality: "highestaudio" });

    // Generate the URLs
    const videoUrlResult = videoFormat.url;
    const audioUrlResult = audioFormat.url;

    return {
      videoUrl: videoUrlResult,
      audioUrl: audioUrlResult,
    };
  } catch (error) {
    console.error("Error fetching download links:", error);
    throw error;
  }
}

/**
 * Helper function to extract the video ID from a YouTube URL.
 * @param {string} url - The YouTube URL.
 * @returns {string|null} - The video ID or null if not found.
 */
function extractVideoID(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const matches = url.match(regex);
  return matches ? matches[1] : null;
}

// Testing the getDownloadLinks function
(async () => {
  const videoUrl = "https://www.youtube.com/watch?v=JM7EPuZuRV8"; // Replace with your video URL
  try {
    const links = await getDownloadLinks(videoUrl);
    
    console.log(`Video URL: ${links.videoUrl}`);
    console.log(`Audio URL: ${links.audioUrl}`);
  } catch (error) {
    console.error("Failed to get download links:", error);
  }
})();

module.exports = { getDownloadLinks };

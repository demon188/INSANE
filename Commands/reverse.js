const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { getFirstLink } = require('extract-links'); // Use getFirstLink
const cheerio = require('cheerio'); // To parse HTML responses

module.exports = {
    name: "reverse",
    description: "Reverse search for an image or sticker from the referenced message.",
    run: async (client, message, args) => {
        try {
            let imageUrl;

            // Check if the message has a reference
            if (!message.reference) {
                return console.log('No message reference found.');
            }

            const referenceMessage = await message.channel.messages.fetch(message.reference.messageId);

            if (referenceMessage.stickers.size > 0) {
                const sticker = referenceMessage.stickers.first();
                const formatType = sticker.format;

                if (formatType === "LOTTIE") {
                    console.log("Lottie sticker detected");
                } else {
                    imageUrl = `https://media.discordapp.net/stickers/${sticker.id}.png`;
                }
            } else if (referenceMessage.attachments.size > 0) {
                const attachment = referenceMessage.attachments.first();
                if (attachment.url) {
                    imageUrl = attachment.url;
                }
            } else if (referenceMessage.content) {
                const contentLinks = getFirstLink(referenceMessage.content); // Extract links from the content
                if (contentLinks) {
                    imageUrl = contentLinks;
                    console.log(imageUrl);
                }
            }

            if (!imageUrl) {
                return console.log('No image or sticker found in the reference message.');
            }

            message.delete();

            // Use Google Lens URL for reverse search
            const searchUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(imageUrl)}`;
            console.log(searchUrl);

            // Fetch content from the search URL
            const response = await axios.get(searchUrl);
            const $ = cheerio.load(response.data);

            // Extract image URLs (you may need to adjust the selector based on the actual response structure)
            const images = [];
            $('img').each((index, element) => {
                if (images.length < 3) { // Limit to 3 images
                    const imgUrl = $(element).attr('src');
                    if (imgUrl) {
                        images.push(imgUrl);
                    }
                }
            });

            if (images.length === 0) {
                return console.log('No images found from the search.');
            }

            // Send images to the current chat
            for (const img of images) {
                await message.channel.send(img);
            }

        } catch (error) {
            console.error(error);
        }
    }
};

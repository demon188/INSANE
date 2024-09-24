const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const lottie = require('lottie-node');
const { getFirstLink } = require('extract-links'); // Ensure you have this module installed

module.exports = {
    description: 'Downloads a user\'s profile picture or image from a reference message, adds meme text with optional color, and sends it.',
    run: async (client, message, args) => {
        try {
            const isPfp = args.includes('-p');
            let imageUrl;
            let memeText = '';
            let fontColor = 'white'; // Default font color

            const fullCommand = args.join(' ');
            const words = fullCommand.split(' ');
            const colorFlag = words.find(word => word.startsWith('-c:'));

            if (colorFlag) {
                fontColor = colorFlag.slice(3);
                words.splice(words.indexOf(colorFlag), 1);
            }

            memeText = words.slice(isPfp ? words.indexOf('-p') + 1 : 0).join(' ');
            memeText = memeText.replace(/<@\d+>/g, '').trim();

            if (isPfp) {
                const user = message.mentions.users.first() || message.author;
                imageUrl = user.displayAvatarURL({ format: 'png', size: 1024 });
            } else {
                if (!message.reference) {
                    return console.log('No message reference found.');
                }

                const referenceMessage = await message.channel.messages.fetch(message.reference.messageId);

                if (referenceMessage.stickers.size > 0) {
                    const sticker = referenceMessage.stickers.first();
                    const formatType = sticker.format;

                    if (formatType === "LOTTIE") {
                        console.log("Lottie sticker detected");
                        // Add handling for Lottie stickers if needed
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
                    if (contentLinks.length > 0) {
                        imageUrl = contentLinks[0];
                        console.log(imageUrl);
                    }
                }

                if (!imageUrl) {
                    return console.log('No image or sticker found in the reference message.');
                }
            }

            message.delete();

            // Check if imageUrl is a URL and download the image
            if (imageUrl.startsWith('http')) {
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                const imagePath = path.join(__dirname, 'temp_image.png');
                fs.writeFileSync(imagePath, response.data);

                const image = await loadImage(imagePath);
                const canvas = createCanvas(image.width, image.height);
                const ctx = canvas.getContext('2d');

                ctx.drawImage(image, 0, 0);

                const lines = memeText.split('\n');

                // Set margins and text area width
                const leftMargin = canvas.width * 0.15;
                const rightMargin = canvas.width * 0.15;
                const textAreaWidth = canvas.width * 0.7;

                // Dynamically calculate font size based on the text area width
                let fontSize = Math.floor(textAreaWidth / 8); // Adjust the ratio if needed
                const lineHeight = fontSize * 1.2;

                // Y-axis margin: Ensure the text starts 20% from the bottom
                const bottomMargin = canvas.height * 0.2;
                const startY = canvas.height - bottomMargin; // Start drawing text 20% from the bottom

                ctx.font = `bold ${fontSize}px sans-serif`;
                ctx.fillStyle = fontColor;
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 4;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Draw the text on the image, moving upwards from the bottom margin
                lines.reverse().forEach((line, index) => {
                    const textX = canvas.width / 2;
                    const textY = startY - index * lineHeight; // Draw lines upwards
                    ctx.strokeText(line, textX, textY);
                    ctx.fillText(line, textX, textY);
                });

                const memeImagePath = path.join(__dirname, 'meme_image.png');
                const out = fs.createWriteStream(memeImagePath);
                const stream = canvas.createPNGStream();
                stream.pipe(out);

                out.on('finish', () => {
                    message.channel.send({ files: [memeImagePath], content: `${message.mentions.users.first() ? message.mentions.users.first() : message.author}`})
                        .then(() => {
                            // Cleanup files
                            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
                            if (fs.existsSync(memeImagePath)) fs.unlinkSync(memeImagePath);
                        })
                        .catch(console.error);
                });
            }
        } catch (error) {
            console.error(error);
            //message.reply('An error occurred while generating the meme.');
        }
    }
};

const { createCanvas } = require('canvas');
const GifEncoder = require('gif-encoder-2');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);

module.exports = {
    description: 'Generates a typewriter effect animated GIF based on the input after .gtype command, sends it, and deletes it.',
    run: async (client, message, handler, prefix) => {
        try {
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();
            
            if (command === 'gtype') {
                const text = args.join(" ");
                await message.edit('✌️');

                if (!text) {
                    return console.log('Please provide text for the typewriter GIF!');
                }

                const canvasWidth = 600;
                const canvasHeight = 80;
                const fontSize = 40;
                const leftMargin = fontSize; // 2 characters space margin
                const delay = 100; // Typewriter effect delay in milliseconds
                const pauseDelay = 1000; // Pause delay after full text display
                const totalFrames = text.length * 2 + 10; // Additional frames for full text display and pause
                const tempGifPath = path.join(__dirname, 'temp_gtype.gif');

                const canvas = createCanvas(canvasWidth, canvasHeight);
                const ctx = canvas.getContext('2d');
                const encoder = new GifEncoder(canvasWidth, canvasHeight);

                encoder.createReadStream().pipe(fs.createWriteStream(tempGifPath));
                encoder.start();
                encoder.setRepeat(0); // 0 for infinite loop
                encoder.setDelay(delay);

                ctx.font = `${fontSize}px Arial`;
                ctx.fillStyle = 'white';
                ctx.textBaseline = 'top';

                // Typewriter effect frames
                for (let i = 0; i < text.length * 2; i++) {
                    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                    const currentText = text.slice(0, Math.floor(i / 2));
                    ctx.fillText(currentText, leftMargin, 10);
                    encoder.addFrame(ctx);
                }

                // Full text display frame
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                ctx.fillText(text, leftMargin, 10);
                for (let i = 0; i < 10; i++) { // Show full text for a short duration
                    encoder.addFrame(ctx);
                }

                encoder.finish();

                // Wait for the GIF file to be fully written
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Check if the command is a reply to another message
                if (message.reference) {
                    const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
                    
                    // Reply to the referenced message with the GIF
                    await referencedMessage.reply({
                        files: [tempGifPath]
                    });
                } else {
                    // If not a reply, send the GIF normally
                    await message.channel.send({
                        files: [tempGifPath]
                    });
                }

                // Delete the temp file after sending
                fs.unlink(tempGifPath, (err) => { if (err) console.error('Error deleting temp GIF file:', err); });
            }
        } catch (error) {
            if (error.code === 'ETIMEDOUT') {
                console.error('Request timed out. Please check your connection or try again later.');
            } else {
                console.error('An error occurred:', error.message || error);
            }
        }
    }
};

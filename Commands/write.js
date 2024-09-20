const { createCanvas, deregisterAllFonts, loadImage, registerFont } = require('canvas');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'write',
    description: 'Writes any text on an image with different font styles',

    run: async (client, message, args) => {
        // Extract the font style and text
        const input = args.join(' ').split(' ');
        const fontKey = input[0].toUpperCase();
        const fontSize = 27; // Font size
        const yAxisMargin = 165; // Y-axis margin
        const lineGap = 13; // Line gap
        const text = args.slice(0).join(' '); // The rest of the input is the text

        // Define fonts and styles with font size
        const fontData = {
            NH: { url: 'https://github.com/Hex231/Res/blob/main/TalkingToTheMoon.ttf?raw=true', size: fontSize },
            CH: { url: 'https://github.com/Hex231/Res/blob/main/Mumsies.ttf?raw=true', size: fontSize },
            SH: { url: 'https://github.com/Hex231/Res/blob/main/Always%20In%20My%20Heart.ttf?raw=true', size: fontSize },
            FH: { url: 'https://github.com/Hex231/Res/blob/main/Husband%20of%20the%20Millennium.ttf?raw=true', size: fontSize },
            UH: { url: 'https://github.com/Hex231/Res/blob/main/Quikhand.ttf?raw=true', size: fontSize },
        };

        const templateUrl = 'https://raw.githubusercontent.com/Hex231/Res/main/template.jpg';

        // Validate input
        if (!text) {
            return console.log('Please provide some text to write on the image.');
        }
        message.edit('✌️');
        const selectedFont = fontData[fontKey] || fontData['NH']; // Default to 'NH' if no style provided

        // Ensure temp directory exists
        if (!fs.existsSync('./temp')) {
            fs.mkdirSync('./temp');
        }

        // Download the font if it doesn't exist
        const fontPath = path.join(__dirname, './temp/QEDSFont.ttf');
        if (!fs.existsSync(fontPath)) {
            try {
                const response = await axios({
                    url: selectedFont.url,
                    responseType: 'arraybuffer',
                });
                fs.writeFileSync(fontPath, Buffer.from(response.data), 'binary');
                console.log('Font downloaded successfully.');
            } catch (err) {
                console.error('Error downloading font:', err);
                return //message.chhane('Failed to download font.');
            }
        }

        // Register the font for canvas
        try {
            registerFont(fontPath, { family: 'CustoFont' });
            console.log('Font registered successfully.');
        } catch (err) {
            console.error('Error registering font:', err);
            return //message.reply('Failed to register font.');
        }

        // Download the template image
        const imgPath = path.join(__dirname, './temp/template.jpg');
        if (!fs.existsSync(imgPath)) {
            try {
                const imgResponse = await axios({
                    url: templateUrl,
                    responseType: 'arraybuffer',
                });
                fs.writeFileSync(imgPath, Buffer.from(imgResponse.data), 'binary');
                console.log('Image downloaded successfully.');
            } catch (err) {
                console.error('Error downloading image:', err);
                return //message.reply('Failed to download image.');
            }
        }

        // Define output file path outside the try block
        const outputFilePath = path.join(__dirname, './temp/output_image.jpg');

        // Load the template image
        try {
            const img = await loadImage(imgPath);
            const canvas = createCanvas(img.width, img.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);

            // Set font and write text on the image
            ctx.font = `${selectedFont.size}px "CustoFont"`;
            console.log('Font set to:', ctx.font);
            ctx.fillStyle = '#011637';

            // Adjust Y-axis margin and write each line of text with line gap
            const lines = text.split('\n');
            let yOffset = yAxisMargin;
            for (const line of lines) {
                ctx.fillText(line, 150, yOffset);
                yOffset += selectedFont.size + lineGap; // Move to next line with line gap
            }

            // Save the image
            const buffer = canvas.toBuffer('image/jpeg');
            fs.writeFileSync(outputFilePath, buffer);

            // Send the image back to the channel
            await message.channel.send({ files: [outputFilePath],content: `${message.mentions.users.first() ? message.mentions.users.first() : "chat"}` });

        } catch (err) {
            console.error('Error processing image:', err);
            return //message.reply('Failed to process image.');
        }

        // Cleanup temp files
        try {
            await fs.promises.unlink(outputFilePath);
            console.log('Output file deleted successfully.');
            // Uncomment these lines if needed
            // await fs.promises.unlink(fontPath);
        } catch (err) {
            console.error('Error during file cleanup:', err);
        }
    }
};

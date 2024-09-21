const { createCanvas, deregisterAllFonts, loadImage, registerFont } = require('canvas');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'write',
    description: 'Writes any text on an image with different font styles',

    run: async (client, message, args) => {
        // Function to break text into lines with a max length of 30 characters without breaking words
        function wrapText(text, maxLineLength = 30) {
            const words = text.split(' ');
            let lines = [];
            let currentLine = '';

            for (let word of words) {
                // Check if adding the word exceeds the max line length
                if ((currentLine + word).length <= maxLineLength) {
                    currentLine += (currentLine ? ' ' : '') + word; // Add the word to the current line
                } else {
                    lines.push(currentLine); // Push the current line to the lines array
                    currentLine = word; // Start a new line with the current word
                }
            }

            // Add the last line if it exists
            if (currentLine) {
                lines.push(currentLine);
            }

            return lines.join('\n'); // Join the lines with a newline character
        }

        // Extract the font style and text
        const input = args.join(' ').split(' ');
        const fontKey = input[0].toUpperCase(); // SH, NH, CH, etc.
        const fontSize = 27; // Font size
        const yAxisMargin = 165; // Y-axis margin
        const lineGap = 13; // Line gap

        // Define fonts and styles with font size
        const fontData = {
            NH: { path: path.join(__dirname, './temp/NH.ttf'), size: fontSize },
            CH: { path: path.join(__dirname, './temp/CH.ttf'), size: fontSize },
            SH: { path: path.join(__dirname, './temp/SH.ttf'), size: fontSize },
            FH: { path: path.join(__dirname, './temp/FH.ttf'), size: fontSize },
            UH: { path: path.join(__dirname, './temp/UH.ttf'), size: fontSize },
        };

        const templateUrl = 'https://raw.githubusercontent.com/Hex231/Res/main/template.jpg';

        // Validate inpu
        await message.edit('✌️');
        
        // Select the font, defaulting to 'NH' if no valid style is provided
        const selectedFont = fontData[fontKey] || fontData['NH'];
        

        // Adjust the text if an invalid font is provided and 'NH' is used as default
         rawText = fontData[fontKey]
            ? args.slice(1).join(' ')  // Use text excluding the font key if a valid font is selected
            : args.slice(0).join(' '); // Use all arguments if an invalid font key defaults to 'NH'
      
        if (!rawText.length) {
        if (message.reference) {
            const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
            rawText = referencedMessage.content + `\n\n --${referencedMessage.member ? referencedMessage.member.displayName : "SOMEONE"}`;
        } else {
            return console.log('Please provide some text to write on the image.');
        }
       };

        // Wrap the text to have lines of about 30 characters each
        const text = wrapText(rawText, 30);

        // Ensure temp directory exists
        if (!fs.existsSync('./temp')) {
            fs.mkdirSync('./temp');
        }

        // Check if the selected font exists locally
        if (!fs.existsSync(selectedFont.path)) {
            console.error('Font file does not exist:', selectedFont.path);
            return;
        }

        // Unlink previous fonts and register the new one
        try {
            deregisterAllFonts(); // Unlink any previously registered fonts
            registerFont(selectedFont.path, { family: 'CustoFont' });
            console.log('Font registered successfully:', selectedFont.path);
        } catch (err) {
            console.error('Error registering font:', err);
            return; // Stop execution if font registration fails
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
                return; // message.reply('Failed to download image.');
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
            await message.channel.send({ files: [outputFilePath], content: `${message.mentions.users.first() ? message.mentions.users.first() : "chat"}` });

        } catch (err) {
            console.error('Error processing image:', err);
            return; // message.reply('Failed to process image.');
        }

        // Cleanup temp files
        try {
            await fs.promises.unlink(outputFilePath);
            console.log('Output file deleted successfully.');
        } catch (err) {
            console.error('Error during file cleanup:', err);
        }
    }
};

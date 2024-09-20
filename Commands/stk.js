const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

// Load configuration from config.json
let config = {};
if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
    console.log('Loaded token:', config.bottoken); // Debug: Ensure token is loaded correctly
}

module.exports = {
    description: 'Creates and sends a local sticker',
    run: async (client, message, handler, prefix) => {
        try {
            const guildId = '785501760722305034'; // Your guild ID
            const stickerName = 'TestSticker';
            const stickerDescription = 'This is a test sticker';
            const stickerTags = 'test,sticker';
            const imagePath = path.join(__dirname, 'sticker.png'); // Path to your local sticker image

            // Read the image file
            const imageData = fs.createReadStream(imagePath);

            // Fetch the guild
            const guild = await client.guilds.fetch(guildId);
            if (!guild) {
                console.error('Guild not found');
                return;
            }

            // Prepare form data for the sticker creation
            const form = new FormData();
            form.append('file', imageData, { filename: 'sticker.png' });
            form.append('name', stickerName);
            form.append('description', stickerDescription);
            form.append('tags', stickerTags);

            // Create the sticker using Discord API endpoint
            const response = await axios.post(`https://discord.com/api/v10/guilds/${guildId}/stickers`, form, {
                headers: {
                    ...form.getHeaders(),
                    'Authorization': `Bot ${config.bottoken}` // Load the token from config.json
                }
            });

            const sticker = response.data;
            console.log(`Sticker created: ${sticker.name}`);

            // Send the sticker in the current channel
            if (message.channel) {
                await message.channel.send({ files: [imagePath] }); // Sending the image file as a message attachment
                console.log('Sticker sent successfully!');
            } else {
                console.error('Channel not found');
            }

        } catch (error) {
            console.error('Error creating or sending sticker:', error.message);
        }
    }
};

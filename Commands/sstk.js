const { MessageAttachment } = require('discord.js-selfbot-v13'); // Correctly import MessageAttachment
const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    description: 'https://appembed.netlify.app/e?description=love%20show%20to%20someone&provider=iN%24aNE&author=VARJoke&image=&color=%23FF0000',
    run: async (client, message, handler, prefix) => {
        try {
            const sourceGuildId = "785501760722305034";
            const stickerId = "1279849962674327632";
            const guild = client.guilds.cache.get(sourceGuildId);

            if (!guild) throw new Error('Source guild not found');

            // Fetch the sticker from the guild
            const sticker = guild.stickers.cache.get(stickerId);
            if (!sticker) throw new Error('Sticker not found in the source guild');

            // Send the sticker in the current channel
            await message.channel.send({ stickers: [stickerId] });
        } catch (error) {
            console.error('Error sending sticker:', error.message);
            message.reply('An error happened when sending the sticker, sorry Boss!');
        }
    }
};

const fetch = require('node-fetch');

module.exports = {
    description: 'Send /daily command to Dank Memer',
    run: async (client, message, handler, prefix) => {
        try {
            message.delete()
            // Bot ID for Dank Memer
            const dankMemerBotId = '270904126974590976'; // Bot ID270904126974590976 270904126974590976
            
            // Send the /daily command using the self-bot
           // await message.channel.sendSlash(dankMemerBotId, 'cleary'); // 'daily' is the command
            await message.channel.sendSlash(dankMemerBotId, 'balance', "")
            message.edit('Sent /daily command to Dank Memer!');
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while sending the /daily command.');
        }
    }
};

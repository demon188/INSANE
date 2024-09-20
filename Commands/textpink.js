const axios = require('axios');
const fs = require('fs');
let config = {};


if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    description: 'https://appembed.netlify.app/e?description=love%20show%20to%20someone&provider=iN%24aNE&author=VARJoke&image=&color=%23FF0000',
    run: async (client, message, handler, prefix) => {
        try {
            
        if (!handler[0]) return 
        message.channel.send(`\`\`\`ansi\n[2;35m${handler.join(' ')}\`\`\``)
        message.delete();
    }
        catch (error) {
            console.error(error);
            message.reply('An error happened when fetching a joke, sorry Boss!');
        }
        
    }
}
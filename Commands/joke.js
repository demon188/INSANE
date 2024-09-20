const axios = require('axios');
const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    description: 'https://appembed.netlify.app/e?description=Type%20VARJoke%20to%20get%20a%20random%20joke!&provider=iN%24aNE&author=VARJoke&image=&color=%23FF0000',
    run: async (client, message, handler, prefix) => {
        try {
           // message.react(config.successEmoji).catch(err => message.react('👍').catch(e => console.log(e)));
            const input = message.content.trim().slice(prefix.length + 5).trim();
            const amount = input.length > 0 ? parseInt(input) : 1;
            // if (amount < 2) {
            //     message.reply(`${config.longstringoftext} https://appembed.netlify.app/e?provider=iN%24aNE&author=Here%20is%20your%20joke!&color=%23FF0000`)
            // } else {
            //     message.reply(`${config.longstringoftext} https://appembed.netlify.app/e?provider=iN%24aNE&author=Here%20are%20your%20jokes!&color=%23FF0000`)
            // }
            
            for (let i = 0; i < amount; i++) {
                const response = await axios.get('https://official-joke-api.appspot.com/jokes/random');
                const title = response.data.setup
                const punchline = response.data.punchline
                message.channel.send(`**${punchline}**`);
            }
        } catch (error) {
            console.error(error);
            message.reply('An error happened when fetching a joke, sorry Boss!');
        }
        message.delete();
    }
}
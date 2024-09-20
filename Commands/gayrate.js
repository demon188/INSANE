const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    description: 'https://appembed.netlify.app/e?description=Send%20VARgayrate%20%40user%20to%20get%20that%20users%20gay%20rate!&provider=TonyskalYTs%20selfbot&author=VARgayrate&image=&color=%23FF0000',
    run: async (client, message, handler, prefix) => {
       // message.react(config.successEmoji).catch(err => message.react('👍').catch(e => console.log(e)));

        const user = message.mentions.users.first();
        if (user === undefined) {
            return;
        }
        const gayRate = Math.floor(Math.random() * 101);

        message.channel.send(`${user.username} is ${gayRate}% :rainbow_flag:`);
    }
};
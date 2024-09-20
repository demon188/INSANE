const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    description: 'https://appembed.netlify.app/e?description=Send%20VARpp%20%40user%20to%20get%20that%20users%20PP%20size!&provider=TonyskalYTs%20selfbot&author=VARpp&image=&color=%23FF0000',
    run: async (client, message, handler, prefix) => {
       // message.react(config.successEmoji).catch(err => message.react('👍').catch(e => console.log(e)));
        const user = message.mentions.users.first();
        if (!user) {
            return;
        }
        user.fetch().then(() => {
            if (user.id !== client.user.id) {
                const randomLength = Math.floor(Math.random() * 33);
                const equals = '='.repeat(randomLength);
                message.edit(`${prefix}pp

${message.content.substring(4)}'s PP size:
8${equals}D
`);
            } else {
                const randomLength = Math.floor(Math.random() * 25) + 24; // Generate random length between 24 and 48
                const equals = '='.repeat(randomLength);
                message.reply(`${message.content.substring(4)}'s PP size:
8${equals}D
      `);
            }
        }).catch(console.error);
    }
};
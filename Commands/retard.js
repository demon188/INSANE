const Canvas = require('canvas');
const Discord = require('discord.js-selfbot-v13');
const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    description: 'https://appembed.netlify.app/e?description=Send%20VARretard%20to%20make%20fun%20of%20somebody%20for%20not%20knowing%20how%20to%20look%20in%20%23bot-invite!&provider=TonyskalYTs%20selfbot&author=VARretard&image=&color=%23FF0000',
    run: async (client, message, handler, prefix, MyID) => {
        message.react(config.successEmoji).catch(err => message.react('👍').catch(e => console.log(e)));
        const canvas = Canvas.createCanvas(500, 500);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('https://media.discordapp.net/attachments/1102185029926391840/1278995603589697548/Screenshot_2.png?ex=66d2d4fa&is=66d1837a&hm=40ddcbed28505c20dd913f2536e24f3b0844ebf0c08cfdedb2f7489734e6017b&=&format=webp&quality=lossless&width=702&height=394');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('please mention a user to generate a moron image with.');
        }

        const avatar = await Canvas.loadImage(user.displayAvatarURL({
            format: 'png'
        }));
        ctx.drawImage(avatar, 30, 298, 100, 100);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'moron.png');
        const embed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle(`Moron ${user.username}`)
            .setDescription(`Here's a moron image with ${user}'s profile picture and name:`)
            .setImage(`attachment://moron.png`);
        message.channel.send({
            embeds: [embed],
            files: [attachment]
        });
    }
};
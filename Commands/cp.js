const Discord = require('discord.js-selfbot-v13');
const Canvas = require('canvas');
const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    description: 'https://appembed.netlify.app/e?description=Send%20VARcaption%20%22image%20link%22%20%22top%22%20%22middle%22%20%22bottom%22%20to%20caption%20a%20image!%20Leave%20quotes%20empty%20if%20unwanted!&provider=TonyskalYTs%20selfbot&author=VARcaption&image=&color=%23FF0000',
    run: async (client, message, handler, prefix, MyID) => {
        try {
            let matches = message.content.match(/\d+|"([^"]*)"/g);
            message.react(config.successEmoji).catch(err => message.react('👍').catch(e => console.log(e)));
            if (matches) {
                let [url, topText, middleText, bottomText] = matches.map(value => value.replace(/"/g, "", ""));
                const image = await Canvas.loadImage(url);
                const canvas = Canvas.createCanvas(image.width, image.height);
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                const maxFontSize = Math.floor(canvas.height / 6);
                let fontSize = maxFontSize;
                ctx.font = `${fontSize}px bold sans-serif`;
                ctx.fillStyle = '#ffffff';
                ctx.lineWidth = 8;
                ctx.strokeStyle = 'black';
                ctx.textAlign = 'center';
                while (ctx.measureText(topText).width > canvas.width - 20 && fontSize > 1) {
                    fontSize--;
                    ctx.font = `${fontSize}px bold sans-serif`;
                }
                ctx.strokeText(topText, canvas.width / 2, canvas.height / 5);
                ctx.fillText(topText, canvas.width / 2, canvas.height / 5);
                fontSize = maxFontSize;
                ctx.font = `${fontSize}px bold sans-serif`;
                ctx.fillStyle = '#ffffff';
                ctx.lineWidth = 8;
                ctx.strokeStyle = 'black';
                ctx.textAlign = 'center';
                while (ctx.measureText(middleText).width > canvas.width - 20 && fontSize > 1) {
                    fontSize--;
                    ctx.font = `${fontSize}px bold sans-serif`;
                }
                ctx.strokeText(middleText, canvas.width / 2, canvas.height / 2);
                ctx.fillText(middleText, canvas.width / 2, canvas.height / 2);
                fontSize = maxFontSize;
                ctx.font = `${fontSize}px bold sans-serif`;
                ctx.fillStyle = '#ffffff';
                ctx.lineWidth = 8;
                ctx.strokeStyle = 'black';
                ctx.textAlign = 'center';
                while (ctx.measureText(bottomText).width > canvas.width - 20 && fontSize > 1) {
                    fontSize--;
                    ctx.font = `${fontSize}px bold sans-serif`;
                }
                ctx.strokeText(bottomText, canvas.width / 2, canvas.height - (canvas.height / 10));
                ctx.fillText(bottomText, canvas.width / 2, canvas.height - (canvas.height / 10));
                const buffer = canvas.toBuffer();
                const attachment = new Discord.MessageAttachment(buffer, 'meme.png');
                const sentMessage = await message.reply({
                    files: [attachment]
                });
                message.reply(`${config.longstringoftext} https://appembed.netlify.app/e?provider=TonyskalYTs%20selfbot&author=Captioned%2520your%2520image%21&image=${sentMessage.attachments.first().url}&color=%23FF0000`)
                sentMessage.delete()
            }
        } catch (err) {
            message.reply(`${config.longstringoftext} https://appembed.netlify.app/e?provider=TonyskalYTs%20selfbot&author=Oh%20shit%21&description=An%20error%20occurred,%20please%20make%20sure%20you%20provided%20a%20valid%20image%20link%21%20&color=%23FF0000`)
            return;
        }
    }
};
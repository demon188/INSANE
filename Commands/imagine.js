const { Configuration, OpenAIApi } = require('openai');
const Discord = require('discord.js-selfbot-v13');
const axios = require('axios');
const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

const configuration = new Configuration({
    apiKey: config.openapiKey || process.env.OPENAI_API_KEY,
});
//console.log(config.openapiKey)
const openai = new OpenAIApi(configuration);
const { Appembed } = require('kyz');

module.exports = {
    description: 'https://appembed.netlify.app/e?t=&c=%23FF0000&a=VARimagine&d=type%20VARimagine%20(prompt)%20to%20generate%20an%20image%20based%20on%20the%20prompt%20using%20DALL-E%203.&p=TonyskalYTs%20selfbot&i=&ic=',
    run: async (client, message, handler, prefix, xToken, MyID) => {
        if (message.author.bot) return;

        try {
            const response = await openai.createImage({
                prompt: "A cat sitting on a window sill", // Example prompt
                n: 1,
                size: "1024x1024"
            });
        
            const imageUrl = response.data.data[0].url;
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        
            const imageBuffer = Buffer.from(imageResponse.data, 'binary');
            const attachment = new Discord.AttachmentBuilder(imageBuffer, { name: 'imagined.png' });
            const sentMessage = await message.reply({ files: [attachment] });
        
            const successEmbed = new Appembed()
                .setAuthor(`Imagined image`)
                .setImage(`${sentMessage.attachments.first().url}`)
                .setProvider("TonyskalYTs selfbot")
                .setColor("#00FF00")
                .build();
            message.reply(`${config.longstringoftext} ${successEmbed}`);
        
            sentMessage.delete();
        
        } catch (err) {
            if (err.response) {
                console.error("Error response data:", err.response.data);
                console.error("Error status:", err.response.status);
                console.error("Error headers:", err.response.headers);
            } else {
                console.error("Error message:", err.message);
            }
            const failEmbed = new Appembed()
                .setAuthor(`Error!`)
                .setDescription(`Something went wrong, check your prompt and try again!`)
                .setProvider("TonyskalYTs selfbot")
                .setColor("#FF0000")
                .build();
            message.reply(`${config.longstringoftext} ${failEmbed}`);
        }
    }
};

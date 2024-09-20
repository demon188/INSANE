const axios = require('axios');
const fs = require('fs');
const path = require('path');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    description: 'https://appembed.netlify.app/e?t=&c=%23FF0000&a=VARimge&d=Type%20%22VARimage%20(prompt)%22%20to%20fetch%20a%20image%20of%20what%20you%20asked%20for.&p=TonyskalYTs%20selfbot&i=&ic=',
    run: async (client, message, handler, prefix) => {
        const search = message.content.trim().slice(prefix.length + 3).trim();
        const URL = `https://api.unsplash.com/search/photos?query=${search}&client_id=YAAa_dkvBC2QcEUx3lykdNkIIYAIiD654Df-5OPu0NA`;
        message.delete();
        try {
            const response = await axios.get(URL);
            if (!response.data.results || response.data.results.length === 0) {
                console.log(config.longstringoftext);
                return;
            }

            const results = response.data.results;
            const randomIndex = Math.floor(Math.random() * results.length);
            const result = results[randomIndex];
            const imageUrl = result.urls.full;

            // Download the image
            const imageResponse = await axios({
                url: imageUrl,
                responseType: 'arraybuffer'
            });

            // Define file path to save the image temporarily
            const imagePath = path.join(__dirname, 'temp_image.jpg');
            fs.writeFileSync(imagePath, imageResponse.data);  // Save the image

            // Send the image as an attachment
            await message.channel.send({
                files: [{
                    attachment: imagePath,
                    name: 'image.jpg'  // You can rename the file if needed
                }]
            });

            // Clean up: Delete the temporary file after sending
            fs.unlinkSync(imagePath);

        } catch (error) {
            console.error(error);
            // Handle error message
            //message.reply(`${config.longstringoftext} https://appembed.netlify.app/e?description=Something%20happened%20when%20search%20for%20an%20image.&provider=TonyskalYTs%20selfbot&author=Error!&color=%23FF0000`);
        }
    }
};

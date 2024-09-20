const axios = require('axios');
const fs = require('fs');
let config = {};


if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}
const animationFrames = [
    "<:notfunny:904136529780285480> ",
    "<:SuprisedSpeed:860771872676642826>  ",
    "<:speed_sad:983148974489874493> ",
    "<:speed_crying:983148807019692032> ",
    "<:notfunny:904136529780285480> ",
    "<:SuprisedSpeed:860771872676642826>  ",
    "<:speed_sad:983148974489874493> ",
    "<:speed_crying:983148807019692032> "
];


module.exports = {
    description: 'https://appembed.netlify.app/e?description=love%20show%20to%20someone&provider=iN%24aNE&author=VARJoke&image=&color=%23FF0000',
    run: async (client, message, handler, prefix) => {
        try {
        
            let frame = 0;
            let editCount = 0; // Counter to keep track of the number of edits

            const interval = setInterval(() => {
            message.edit(animationFrames[frame]);
            frame = (frame + 1) % animationFrames.length;
            editCount++; // Increment the counter each time the message is edited

            if (editCount >= 10) { // Check if the message has been edited 10 times
            clearInterval(interval);
            message.edit(`<:SuprisedSpeed:860771872676642826> Not Funny Bruh !! ${message.mentions.users.first() ? message.mentions.users.first() : message.author}`)
            //console.log("loop breaked") // Stop the interval
            }
            }, 500);
         // message.edit(`█▀▀ ▄▀█ █▄█\n█▄█ █▀█ ░█░ ) ${message.mentions.users.first() ? message.mentions.users.first() : message.author}`)
        }
        catch (error) {
            console.error(error);
            message.reply('An error happened when fetching a joke, sorry Boss!');
        }
        
    }
}
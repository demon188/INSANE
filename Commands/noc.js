const axios = require('axios');
const fs = require('fs');
let config = {};


if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}
const animationFrames = [
      "\u200B                                              🚶", // 7 non-breaking spaces
      "\u200B                                         🚶",
      "\u200B                                      🚶**E**",
      "\u200B                                  🚶**RE**",
      "\u200B                               🚶**ARE**",
      "\u200B                           🚶**CARE**",
      "\u200B                       🚶**Y CARE**",
      "\u200B                   🚶**DY CARE**",
      "\u200B                🚶**ODY CARE**",
      "\u200B            🚶**BODY CARE**",
      "\u200B        🚶**O BODY CARE**",
      "\u200B    🚶**NO BODY CARE**",
      "\u200B🚶**NO BODY CARE**",
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

            if (editCount >= 13) { // Check if the message has been edited 10 times
            clearInterval(interval);
            message.edit(`\u200B🚶**NO BODY CARE** !! ${message.mentions.users.first() ? message.mentions.users.first() : message.author}`)
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
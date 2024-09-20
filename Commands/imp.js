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
            let anmf = "";
            let msg = "Hehe. I'm ";
            if (message.reference) {
                const repliedMessage = await message.fetchReference(); // Await fetching the reference
                msg = ` ${repliedMessage.author} is `;
            } else if (message.mentions.users.size > 0) {
                msg += ` ${message.mentions.users.first()} is `;
            }
            const animationFrames = [
                "...╭──────╮",
                "\n╭┆...╭────╮",
                "\n┆┆...╰────╯",
                "\n┆┆....................┆🔪",
                "\n╰┆....┆ ─┌....┆",
                "\n….╰─╯....╰─╯.",
                `\n\n${msg}the imposter👿`
              ];
            let frame = 0;
            let editCount = 0; // Counter to keep track of the number of edits

            const interval = setInterval(() => {
              anmf +=  animationFrames[frame];
            message.edit(anmf);
            frame = (frame + 1) % animationFrames.length;
            editCount++; // Increment the counter each time the message is edited

            if (editCount >= animationFrames.length) { // Check if the message has been edited 10 times
            clearInterval(interval);
            //message.edit(`\u200B🚶**NO BODY CARE** !! ${message.mentions.users.first() ? message.mentions.users.first() : message.author}`)
            //console.log("loop breaked") // Stop the interval
            }
            }, 900);
         // message.edit(`█▀▀ ▄▀█ █▄█\n█▄█ █▀█ ░█░ ) ${message.mentions.users.first() ? message.mentions.users.first() : message.author}`)
        }
        catch (error) {
            console.error(error);
            message.reply('An error happened when fetching a joke, sorry Boss!');
        }
        
    }
}
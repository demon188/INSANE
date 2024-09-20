const axios = require('axios');
const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

const animationFrames = [
    "🚪                                              🐒", // Monkey far from the door
    "🚪                                      🐒",
    "🚪                               🐒",
    "🚪                       🐒",
    "🚪                🐒",
    "🚪        🐒",
   // "🚪   🐒",
    "🚪🐒", 
    "🐒🚪",  // Monkey reaches the door
    "🚪",   // Door closes after the monkey enters
];

module.exports = {
    description: 'https://appembed.netlify.app/e?description=love%20show%20to%20someone&provider=iN%24aNE&author=VARJoke&image=&color=%23FF0000',
    run: async (client, message, handler, prefix) => {
        try {
            let frame = 0;
            let editCount = 0; // Counter to keep track of the number of edits

            const interval = setInterval(async () => { // Make this function async
                message.edit(animationFrames[frame]);
                frame = (frame + 1) % animationFrames.length;
                editCount++; // Increment the counter each time the message is edited

                if (editCount >= animationFrames.length) { // Check if the message has been edited for all frames
                    clearInterval(interval);

                    // Check if the message is a reply or mentions someone
                    let finalMessage = `🚪  **WHY DID U LEAVE!!**`;
                    if (message.reference) {
                        const repliedMessage = await message.fetchReference(); // Await fetching the reference
                        finalMessage += ` !! ${repliedMessage.author}`;
                    } else if (message.mentions.users.size > 0) {
                        finalMessage += ` !! ${message.mentions.users.first()}`;
                    }

                    message.edit(finalMessage);
                }
            }, 500);
        } catch (error) {
            console.error(error);
            message.reply('An error happened when fetching a joke, sorry Boss!');
        }
    }
}

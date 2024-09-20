const axios = require('axios');
const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

const animationFrames = [
    "Mirrors can’t talk, lucky for you they can’t laugh either.",
    "People like you are the reason we have middle fingers.",
    "When your mom dropped you off at the school, she got a ticket for littering.",
    "What’s the point of putting on makeup, a monkey is gonna stay a monkey.",
    "Zombies eat brains. You’re safe.",
    "Wow! You have a huge pimple in between your shoulders! Oh wait that’s your face.",
    "Your intelligence is my common sense.",
    "Act your age not your shoe size.",
    "Your age doesn’t lie. Neither does that face.",
    "Yes, you do have a right to your opinion…And I have a right to mine. And my opinion is that your opinion is ridiculously stupid!!",
    "You’re so much smarter when you don’t speak!"
];

module.exports = {
    description: 'https://appembed.netlify.app/e?description=love%20show%20to%20someone&provider=iN%24aNE&author=VARJoke&image=&color=%23FF0000',
    run: async (client, message, handler, prefix) => {
        try {
            let frame = 0;
            message.edit("wait a sec");
            let editCount = 0; // Counter to keep track of the number of edits

            const interval = setInterval(async () => { // Make this function async
                message.edit(`:ear:  **${animationFrames[frame]}**`);
                frame = (frame + 1) % animationFrames.length;
                editCount++; // Increment the counter each time the message is edited

                if (editCount >= animationFrames.length) { // Check if the message has been edited for all frames
                    let finalMessage = `:ear: **${animationFrames[frame]}!**`;
                    clearInterval(interval);

                    // Check if the message is a reply or mentions someone
                    if (message.reference) {
                        const repliedMessage = await message.fetchReference(); // Await fetching the reference
                        finalMessage += ` !! ${repliedMessage.author}`;
                    } else if (message.mentions.users.size > 0) {
                        finalMessage += ` !! ${message.mentions.users.first()}`;
                    }

                    message.edit(finalMessage);
                }
            }, 4000);
        } catch (error) {
            console.error(error);
            message.reply('An error happened when fetching a joke, sorry Boss!');
        }
    }
}

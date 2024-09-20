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
            let frame = 0;
            let editCount = 0; // Counter to keep track of the number of edits
            const getInputs = message.content.trim().slice(prefix.length + 4).trim();
            const qry = `:telephone: :woman_police_officer: What is Your Emergency? \n Me:speaking_head:  ${getInputs}!`;
            const qry2 = `:telephone: :woman_police_officer: What is Your Emergency? \n Me:speaking_head:  ${getInputs}!\n:telephone: :woman_police_officer: hell Nooo!! `;

            const animationFrames = [
                ":telephone:  Dialing 9...",
                ":telephone:  Dialing 91...",
                ":telephone:  Dialing 911...",
                ":telephone: :cyclone: Connecting...",
                ":telephone:  Connected :white_check_mark:  ",
                ":telephone: :woman_police_officer: What is Your Emergency? ",
                `${qry}`,
                `${qry}\n:telephone: :woman_police_officer: hell Nooo!! `,
                `${qry2}\n\n📢 911 Emergency Response...`,
                `${qry2}\n\n🚔 Police on the way...`,
                `${qry2}\n\n🚑 Ambulance dispatched...`,
                `${qry2}\n\n🚒 Fire truck en route...`,
                `${qry2}\n\n🏥 Emergency services arrived...`,
                `${qry2}\n\n:telephone: 911 Call Ended.`,
                `**You Are Now In Jail. **🔒`
            ];

            const delays = [
                500, // Delay for the first frame
                500, // Delay for the second frame
                500, // Delay for the third frame
                1500, // Delay for the fourth frame
                1300, // Delay for the fifth frame
                1500, // Delay for the sixth frame
                2000,
                1500, // Delay for the seventh frame
                1500, // Delay for the eighth frame
                1500, // Delay for the ninth frame
                1500, // Delay for the tenth frame
                1100, // Delay for the eleventh frame
                1100, // Delay for the twelfth frame
                1100, // Delay for the thirteenth frame
                2000  // Delay for the final frame
            ];

            const runAnimation = () => {
                if (editCount < animationFrames.length) {
                    message.edit(animationFrames[frame]);
                    frame++;
                    editCount++;
                    setTimeout(runAnimation, delays[editCount - 1]); // Set the delay for the next edit
                } else {
                    if (message.reference) {
                        message.edit(`\u200B**You Are Now In Jail.** 🔒 ${message.mentions.users.first() ? message.mentions.users.first() : message.author}`);
                    }
                }
            };

            runAnimation(); // Start the animation
        } catch (error) {
            console.error(error);
            message.reply('An error happened when fetching a joke, sorry Boss!');
        }
    }
}

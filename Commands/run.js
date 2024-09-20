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
            const commandContent = message.content.trim().slice(prefix.length + 4).trim();
            
            let A = ':orangutan: '; // Default emoji for A
            let B = ':t_rex: '; // Default emoji for B

            const vsIndex = commandContent.indexOf(' vs ');

            if (vsIndex !== -1) {
                // Extracting names before and after 'vs'
                A = commandContent.slice(0, vsIndex).trim();
                B = commandContent.slice(vsIndex + 4).trim();
            } else if (commandContent.length > 0) {
                B = commandContent; // If only one name/emoji is provided, it goes to B
                A = `${message.mentions.users.first() ? message.mentions.users.first() : message.author}`;
            }

            const args = message.content.split(' ').slice(1);
            let user;
            
            // Check if there is a mention
            if (message.mentions.users.size > 0) {
                user = message.mentions.users.first();
            } else if (args.length > 0) {
                // Try to find the user by username if not mentioned
                const username = args.join(' ').trim();
                user = message.guild.members.cache.find(member => member.user.username === username)?.user;
            }

            // If no user found, default to the message author
            user = user || message.author;

            // if (message.reference) {
            //     const repliedMessage = await message.fetchReference();
            //     A = `${user.tag} (${A})`;
            // } else if (message.mentions.users.size > 0) {
            //     A = `${user.tag} (${A})`;
            // }

            const animationFrames1 = [
                `**Who will Win?** ${A} vs ${B} race starting... 3`,
                `**Who will Win?** ${A} vs ${B} race starting... 3`,
                `**Who will Win?** ${A} vs ${B} race starting... 2`,
                `**Who will Win?** ${A} vs ${B} race starting... 2`,
                `**Who will Win?** ${A} vs ${B} race starting... 1`,
                `**Who will Win?** ${A} vs ${B} race starting... 1`,
                `--------win-------\n\n\n\n\n\n\n       ${A}        ${B} \nWho will Win?`,
                `--------win-------\n\n\n\n\n\n       ${A}        ${B}\nWho will Win?`,
                `--------win-------\n\n\n\n       ${A}\n                  ${B}\n\nWho will Win?`,
                `--------win-------\n\n\n       ${A}\n                  ${B}\n\n\n\nWho will Win?`,
                `--------win-------\n       ${A}\n\n                  ${B}\n\n\n\n\nWho will Win?`,
                `--------win-------\n       ${A}\n                  ${B}\n\n\n\n\n\nWho will Win?`,
                `--------win-------\n       ${A}        ${B}\n\n\n\n\n\n\nWho will Win?`
            ];

            const animationFrames2 = [
                `**Who will Win?** ${A} vs ${B} race starting... 3`,
                `**Who will Win?** ${A} vs ${B} race starting... 3`,
                `**Who will Win?** ${A} vs ${B} race starting... 2`,
                `**Who will Win?** ${A} vs ${B} race starting... 2`,
                `**Who will Win?** ${A} vs ${B} race starting... 1`,
                `**Who will Win?** ${A} vs ${B} race starting... 1`,
                `--------win-------\n\n\n\n\n\n\n       ${A}        ${B} \nWho will Win?`,
                `--------win-------\n\n\n\n\n\n       ${A}        ${B}\nWho will Win?`,
                `--------win-------\n\n\n\n\n       ${A}        ${B}\n\nWho will Win?`,
                `--------win-------\n\n\n\n       ${A}        ${B}\n\n\n\nWho will Win?`,
                `--------win-------\n\n                  ${B}\n       ${A}     \n\n\n\n\nWho will Win?`,
                `--------win-------\n                  ${B}\n\n       ${A}     \n\n\n\n\nWho will Win?`,
                `--------win-------\n                  ${B}\n       ${A}\n\n\n\n\n\nWho will Win?`,
                `--------win-------\n       ${A}        ${B}\n\n\n\n\n\n\nWho will Win?`
            ];

            let frame = 0;
            let editCount = 0;
            const randomValue = Math.random();
            const isAnimationFrames1 = randomValue < 0.5;
            const animationFrames = isAnimationFrames1 ? animationFrames1 : animationFrames2;
            const winner = isAnimationFrames1 
                ? `Congratulations :clap: ${A}, you beat (${B}) in the Race!!` 
                : `${A} lost to (${B}) in the Race.  :sweat_smile:  `;

            const interval = setInterval(async () => {
                message.edit(animationFrames[frame]);
                frame = (frame + 1) % animationFrames.length;
                editCount++;

                if (editCount >= animationFrames.length) {
                    clearInterval(interval);
                    message.edit(`  **${winner}**`);
                }
            }, 500);
        } catch (error) {
            console.error(error);
            message.reply('An error happened when fetching a joke, sorry Boss!');
        }
    }
};

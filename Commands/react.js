const fs = require("fs");
const path = './react.json';

module.exports = {
    description: 'Automatically reacts to messages with specified emojis based on react.json.',
    run: async (client, message, handler) => {
        // Parse the command input for emojis and loop status
        let input = handler.join(" ");
        
        // Extract emojis and check for loop flag (-l:true)
        const emojiPattern = /<a?:\w+:\d+>|[\p{Emoji_Presentation}\p{Emoji}\p{Extended_Pictographic}]/gu;
        const emojis = input.match(emojiPattern) || [];
        const loop = input.includes("-l:true");

        // Check if the command is ".react stop"
        if (handler[0] === "stop") {
            // Initialize reactData to clear emojis and set loop to false
            const reactData = { emojis: [], loop: false };
            fs.writeFileSync(path, JSON.stringify(reactData, null, 2));
            return console.log("Reaction loop stopped and emojis cleared.");
        }

        // Update or create react.json with the provided emojis and loop status
        const reactData = { emojis, loop };
        fs.writeFileSync(path, JSON.stringify(reactData, null, 2));

        console.log(`Set emojis to react with: ${emojis.join(" ")}. Loop: ${loop}`);
    }
};

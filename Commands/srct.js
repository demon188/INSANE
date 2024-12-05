const fs = require("fs");
const path = './srct.json';

module.exports = {
    description: 'Stores emojis, server ID, and reaction count in srct.json or clears them with "stop".',
    run: async (client, message, handler) => {
        // Check if the command is ",srct stop"
        if (handler[0] === "stop") {
            // Clear the parameters and set reaction count to 0
            const srctData = { serverId: null, emojis: [], count: 0 };
            fs.writeFileSync(path, JSON.stringify(srctData, null, 2));
            return console.log("Reaction parameters cleared and count set to 0.");
        }
        message.delete();
        // Parse the command input
        let input = handler.join(" ");

        // Regular expressions for extracting data
        const emojiPattern = /<a?:\w+:\d+>|[\p{Emoji_Presentation}\p{Emoji}\p{Extended_Pictographic}]/gu;
        const serverIdPattern = /-s:[0-9]+/;
        const countPattern = /-c:\d+/;

        // Unicode list for skin tone modifiers
        const skinToneModifiers = [
            '\u{1F3FB}', // Light Skin Tone
            '\u{1F3FC}', // Medium-Light Skin Tone
            '\u{1F3FD}', // Medium Skin Tone
            '\u{1F3FE}', // Medium-Dark Skin Tone
            '\u{1F3FF}'  // Dark Skin Tone
        ];

        // Extract server ID and count
        const serverIdMatch = input.match(serverIdPattern);
        const countMatch = input.match(countPattern);

        const serverId = serverIdMatch ? serverIdMatch[0].split(":")[1] : message.guild.id; // Default to current server ID
        const count = countMatch ? parseInt(countMatch[0].split(":")[1], 10) : 10; // Default count to 10

        // Remove `-s:data` and `-c:data` from the input string
        const sanitizedInput = input
            .replace(serverIdPattern, "") // Remove server ID
            .replace(countPattern, "")   // Remove count
            .trim(); // Clean up any extra whitespace

        // Extract emojis and filter out skin tone modifiers
        const emojis = (sanitizedInput.match(emojiPattern) || []).filter(emoji => !skinToneModifiers.includes(emoji));

        if (emojis.length === 0) {
            return console.log("No valid emojis provided. Please include at least one emoji.");
        }

        // Prepare data object
        const srctData = {
            serverId,
            emojis,
            count
        };

        // Write data to srct.json
        fs.writeFileSync(path, JSON.stringify(srctData, null, 2));
        console.log(`Saved to srct.json: ServerID: ${serverId}, Emojis: ${emojis.join(" ")}, Count: ${count}`);
    }
};

const Discord = require('discord.js-selfbot-v13');
const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

// Emoji map for letters, space, and expressions
const emojiMap = {
    'a': '🇦', 'b': '🇧', 'c': '🇨', 'd': '🇩', 'e': '🇪', 'f': '🇫', 'g': '🇬', 
    'h': '🇭', 'i': '🇮', 'j': '🇯', 'k': '🇰', 'l': '🇱', 'm': '🇲', 'n': '🇳', 
    'o': '🇴', 'p': '🇵', 'q': '🇶', 'r': '🇷', 's': '🇸', 't': '🇹', 'u': '🇺', 
    'v': '🇻', 'w': '🇼', 'x': '🇽', 'y': '🇾', 'z': '🇿',
    ' ': '⬛', // Placeholder emoji for space
    '?': '❓', // Question mark emoji
    '!': '❗', // Exclamation mark emoji
    '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣', '0': '0️⃣'
};

// Regular expression to match custom emojis (animated and static)
const customEmojiRegex = /<a?:\w+:\d+>/g; // Capture custom emojis like <a:emoji_name:emoji_id>
const emojiRegex = /[\uD83C-\uDBFF\uDC00-\uDFFF]+|[\u2600-\u27BF]|[\u2B50\u3030\u303D\u3297\u3299\uFE0F]/g; // Standard emojis (Unicode)

// Helper function to replace letters and numbers with corresponding emojis
function convertTextToEmoji(text) {
    return text
        .split('')
        .map(char => emojiMap[char] || char) // Convert each character using the emoji map
        .join('');
}

module.exports = {
    description: 'React to a message with letter, expression character, and actual emojis based on a word or phrase.',
    run: async (client, message, handler, prefix) => {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === 'rct') {
            const word = args.join('').toLowerCase();
            if (!word) return console.log('Please provide a word or phrase to react with.');
            message.delete();

            // Check if the message is a reply
            if (!message.reference) {
                console.log('Please reply to another message to use this command.');
                return;
            }

            // Fetch the replied-to message
            const msgToReact = await message.channel.messages.fetch(message.reference.messageId);

            // Track duplicate emojis to avoid skipping same letter reactions
            const usedEmojis = new Set();

            // Step 1: Handle custom emojis
            const customEmojis = word.match(customEmojiRegex); // Capture all custom emojis
            if (customEmojis) {
                // Process each custom emoji in the word
                for (const customEmoji of customEmojis) {
                    const customEmojiMatch = customEmoji.match(/^<a?:(\w+):(\d+)>$/);
                    if (customEmojiMatch) {
                        const customEmojiID = customEmojiMatch[2];
                        const emoji = client.emojis.cache.get(customEmojiID); // Get the custom emoji using ID
                        if (emoji && !usedEmojis.has(emoji)) {
                            console.log(`Attempting to react with custom emoji: ${emoji}`);
                            await msgToReact.react(emoji).catch(err => console.log(`Failed to react with custom emoji: ${emoji}: ${err}`));
                            usedEmojis.add(emoji);
                        }
                    }
                }
            }

            // Step 2: Process non-custom characters (letters/numbers) after custom emojis
            const remainingText = word.replace(customEmojiRegex, ''); // Remove custom emojis from text
            const emojiText = convertTextToEmoji(remainingText);

            for (const char of emojiText) {
                if (!usedEmojis.has(char)) {
                   // console.log(`Attempting to react with emoji: ${char}`);
                    await msgToReact.react(char).catch(err => console.log(`Failed to react with emoji: ${char}: ${err}`));
                    usedEmojis.add(char);
                }
            }
        }
    }
};

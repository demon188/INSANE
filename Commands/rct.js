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
    ' ': '➖',  // space represented by a dash emoji
    '?': '❓',  // question mark emoji
    '!': '❗',  // exclamation mark emoji
    '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣', '0': '0️⃣'
};

module.exports = {
    description: 'React to a message with letter and expression character emojis based on a word or phrase.',
    run: async (client, message, handler, prefix) => {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === 'rct') {
            const word = args.join('').toLowerCase();
            if (!word) return console.log('Please provide a word or phrase to react with.');
            message.delete();

            const msgToReact = message.reference ? await message.channel.messages.fetch(message.reference.messageId) : message;
            
            // Track duplicate emojis to avoid skipping same letter reactions
            const usedEmojis = new Set();

            for (const char of word) {
                const emoji = emojiMap[char];
                if (emoji && !usedEmojis.has(emoji)) {
                    await msgToReact.react(emoji).catch(err => console.log(`Failed to react with ${emoji}: ${err}`));
                    usedEmojis.add(emoji);
                } else if (emoji) {
                    await new Promise(resolve => setTimeout(resolve, 500)); // slight delay to handle duplicate emojis
                    await msgToReact.react(emoji).catch(err => console.log(`Failed to react with ${emoji}: ${err}`));
                }
            }
        }
    }
};

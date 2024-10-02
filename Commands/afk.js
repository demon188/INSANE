const fs = require('fs');
const path = './afk.json'; // Path to store AFK data

module.exports = {
    description: 'Sets an AFK status and reason',
    run: async (client, message, handler, prefix) => {
        const args = message.content.slice(prefix.length).trim().split(/ +/).slice(1); 
        const reason = args.join(' ') || 'Working'; // Default reason if none provided
        const afkData = {
            is_afk: true,
            reason,
            timestamp: Date.now() // Store the time when AFK was set
        };

        // Save AFK data (set AFK status to true)
        fs.writeFileSync(path, JSON.stringify(afkData, null, 2));

        // Notify the user that AFK has been set
        await message.edit(`AFK set: ${reason}`);
    }
};

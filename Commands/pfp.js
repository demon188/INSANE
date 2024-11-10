const fs = require('fs');
const axios = require('axios');
const path = require('path');

module.exports = {
    description: 'Fetch and edit a message with a user\'s profile picture using ".pfp userid" or ".pfp userid serverid".',
    run: async (client, message, handler, prefix, MyID) => {
        if (message.author.id !== client.user.id) return;

        const args = message.content.split(" ");
        if (args[0] === `${prefix}pfp`) {
            const userId = args[1];
            const serverId = args[2];

            try {
                let user;
                let avatarUrl;

                if (serverId) {
                    const guild = client.guilds.cache.get(serverId);
                    if (!guild) return message.edit("Invalid server ID.");

                    const member = await guild.members.fetch(userId);
                    user = member.user;

                    // Use server-specific avatar if available, else fallback to global avatar
                    avatarUrl = member.avatar
                        ? member.displayAvatarURL({ dynamic: true, size: 512 })
                        : user.displayAvatarURL({ dynamic: true, size: 512 });
                } else {
                    user = await client.users.fetch(userId);
                    avatarUrl = user.displayAvatarURL({ dynamic: true, size: 512 });
                }

                const filePath = path.resolve(__dirname, `${user.id}_avatar.png`);

                const response = await axios({
                    url: avatarUrl,
                    responseType: 'stream',
                });
                const writer = fs.createWriteStream(filePath);
                response.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });

                await message.edit({
                    content: `<@${user.id}>'s Profile Picture`,
                    files: [filePath],
                });

                fs.unlinkSync(filePath);
            } catch (error) {
                console.error(error);
                await message.edit("Error: Unable to fetch or send profile picture.");
            }
        }
    }
};

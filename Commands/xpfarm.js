const fs = require("fs");
const { PermissionsBitField, ChannelType } = require("discord.js");
const path = './xpfarm.json';

let farmInterval = null;

module.exports = {
    description: 'Farms XP by sending messages copied from users in an old section of the chat. Stops with ".xpfarm stop".',
    run: async (client, message, handler, prefix) => {
        const input = message.content.slice(prefix.length + 7).trim();

        // Stop command
        if (input === "stop") {
            if (farmInterval) {
                clearInterval(farmInterval);
                farmInterval = null;
                fs.writeFileSync(path, JSON.stringify({ running: false }, null, 2));
                message.delete().catch(() => {});
            }
            return;
        }

        // Parse options
        const serverIdMatch = input.match(/-s:([0-9]+)/);
        const channelIdMatch = input.match(/-ch:([0-9]+)/);
        const intervalMatch = input.match(/-inv:(\d+)/);

        const serverId = serverIdMatch?.[1];
        const channelId = channelIdMatch?.[1];
        const intervalSec = intervalMatch ? parseInt(intervalMatch[1], 10) : 60;

        if (!serverId || !channelId) return;

        const guild = client.guilds.cache.get(serverId);
        const channel = guild?.channels.cache.get(channelId);

        if (!guild || !channel || channel.type !== ChannelType.GuildText) return;
        message.reply('📡 XP farming started...');

        const emojiRegex = /<a?:\w+:\d+>/g;
        const streetRegex = /\b(street|road|lane|avenue|drive|blvd|way|cross)\b/i;
        const ggerWordRegex = /\b\w*gger\b/i;
        const longNumberRegex = /\d{5,}/;  // Any number with 5+ digits

        const fetchAndFilterMessages = async () => {
            try {
                const messages = await channel.messages.fetch({ limit: 100 });

                return messages
                    .filter(msg => {
                        const member = guild.members.cache.get(msg.author.id);
                        const isMod = member?.permissions?.has(PermissionsBitField.Flags.ManageMessages);
                        const isBot = msg.author.bot;
                        const hasMention = msg.mentions.users.size > 0;

                        const content = msg.content;
                        const isOnlyEmoji = content.replace(emojiRegex, '').trim().length === 0;
                        const isEnglish = /^[\p{ASCII}\p{Emoji}\s]+$/u.test(content);

                        const hasStreet = streetRegex.test(content);
                        const hasGger = ggerWordRegex.test(content);
                        const hasLongNumber = longNumberRegex.test(content);

                        return (
                            !isBot &&
                            !isMod &&
                            typeof content === "string" &&
                            content.length > 3 &&
                            content.length < 28 &&
                            !hasMention &&
                            !isOnlyEmoji &&
                            isEnglish &&
                            !hasStreet &&
                            !hasGger &&
                            !hasLongNumber
                        );
                    })
                    .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
                    .slice(0, 50);
            } catch (err) {
                console.error("Failed to fetch messages:", err.message);
                return [];
            }
        };

        let messageArray = await fetchAndFilterMessages();
        if (messageArray.length === 0) return;

        const farmConfig = {
            running: true,
            serverId,
            channelId,
            interval: intervalSec
        };
        fs.writeFileSync(path, JSON.stringify(farmConfig, null, 2));

        let currentIndex = 0;
        let sentCount = 0;
        let lastMessages = [];

        farmInterval = setInterval(async () => {
            if (!messageArray.length) return;

            let validMessageFound = false;
            let attempts = 0;

            while (!validMessageFound && attempts < messageArray.length) {
                if (!messageArray[currentIndex]) currentIndex = 0;

                let msgContent = messageArray[currentIndex].content;
                msgContent = msgContent.replace(emojiRegex, '.').trim();

                if (!lastMessages.includes(msgContent) && msgContent.length > 0) {
                    validMessageFound = true;
                    channel.send(msgContent).catch(() => {});
                    lastMessages.push(msgContent);
                    if (lastMessages.length > 10) lastMessages.shift();
                    sentCount++;
                }

                currentIndex++;
                attempts++;
            }

            if (sentCount % 10 === 0) {
                const updatedMessages = await fetchAndFilterMessages();
                if (updatedMessages.length) {
                    messageArray = updatedMessages;
                    currentIndex = 0;
                }
            }
        }, intervalSec * 1000);
    }
};

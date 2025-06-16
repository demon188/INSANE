const fs = require("fs");
const path = './xpfarm.json';

let farmInterval = null;

module.exports = {
    description: 'Farms XP by sending messages copied from users in an old section of the chat. Stops with ".xpfarm stop".',
    run: async (client, message, handler, prefix) => {
        const input = message.content.slice(prefix.length + 7).trim();
        // console.log(`Received command: ${input}`);

        // Stop command
        if (input === "stop") {
            if (farmInterval) {
                clearInterval(farmInterval);
                farmInterval = null;
                fs.writeFileSync(path, JSON.stringify({ running: false }, null, 2));
                // console.log("🛑 XP farming stopped.");
                return;
            } else {
                // console.log("⚠️ XP farming is not running.");
                return;
            }
        }

        // Parse options
        const serverIdMatch = input.match(/-s:([0-9]+)/);
        const channelIdMatch = input.match(/-ch:([0-9]+)/);
        const intervalMatch = input.match(/-inv:(\d+)/);

        const serverId = serverIdMatch?.[1];
        const channelId = channelIdMatch?.[1];
        const intervalSec = intervalMatch ? parseInt(intervalMatch[1], 10) : 60;

        // console.log(`Parsed options: serverId=${serverId}, channelId=${channelId}, intervalSec=${intervalSec}`);

        if (!serverId || !channelId) {
            // console.log("❌ Missing required parameters: -s:<serverId> and -ch:<channelId>");
            return;
        }

        const guild = client.guilds.cache.get(serverId);
        const channel = guild?.channels.cache.get(channelId);

        if (!guild || !channel || channel.type !== "GUILD_TEXT") {
            // console.log("❌ Invalid or non-text channel.");
            return;
        }

        // console.log("📥 Fetching messages...");
        let messages;
        try {
            messages = await channel.messages.fetch({ limit: 100 });
            // console.log(`Fetched ${messages.size} messages from channel ${channelId}.`);
        } catch (err) {
            // console.error("❌ Could not fetch messages.", err);
            return;
        }

        // Regex to match server emojis like <a:Uhm:1078413040157999174>
        const emojiRegex = /<a?:\w+:\d+>/g;

        // Filter messages
        const messageArray = Array.from(messages.values())
        .filter(msg => {
            const member = guild.members.cache.get(msg.author.id);
            const isMod = member?.permissions?.has("MANAGE_MESSAGES");
            const isBot = msg.author.bot;
            const hasMention = msg.mentions.users.size > 0;
    
            return (
                !isBot &&
                !isMod &&
                typeof msg.content === "string" &&
                msg.content.length > 3 &&
                msg.content.length < 28 && // ✅ Less than 28 characters
                !hasMention                // ✅ No user mentions
            );
        })
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
        .slice(0, 50);

        if (messageArray.length === 0) {
            // console.log("⚠️ No valid messages found to farm.");
            return;
        }

        // Save current config
        const farmConfig = {
            running: true,
            serverId,
            channelId,
            interval: intervalSec
        };
        fs.writeFileSync(path, JSON.stringify(farmConfig, null, 2));

        // console.log(`✅ Farming in server ${serverId}, channel ${channelId}, interval: ${intervalSec}s`);

        // Start farming
        let currentIndex = 0;
        farmInterval = setInterval(() => {
            if (!messageArray[currentIndex]) currentIndex = 0;

            let msgContent = messageArray[currentIndex].content;

            // Replace all server emojis with '.' for safer sending
            if (emojiRegex.test(msgContent)) {
                msgContent = msgContent.replace(emojiRegex, '.');
            }

            channel.send(msgContent).catch(() => {});
            // console.log(`📤 Sent: ${msgContent}`);

            currentIndex++;
        }, intervalSec * 1000);

        // Clean up original command
        // message.delete().catch(() => {});
    }
};

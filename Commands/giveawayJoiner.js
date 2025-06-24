module.exports = {
    run: async (client, message) => {
        const GUILD_ID = "800906094729101353";
        const CHANNEL_ID = "939307949472514110";
        const GIVEAWAY_BOT_ID = "530082442967646230";

        // Ensure it's from the giveaway bot and correct channel/server
        if (
            message.guild?.id !== GUILD_ID ||
            message.channel?.id !== CHANNEL_ID ||
            message.author?.id !== GIVEAWAY_BOT_ID
        ) return;

        try {
            const components = message.components;
            if (!components || components.length === 0) return;

            for (const row of components) {
                for (const button of row.components) {
                    if (button.emoji?.name === "🎉") {
                        await message.clickButton(button.customId);
                        console.log(`🎉 Joined giveaway: ${message.id}`);
                        return;
                    }
                }
            }
        } catch (err) {
            console.error("❌ Failed to join giveaway:", err.message);
        }
    }
};

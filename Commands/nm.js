const fetch = require('node-fetch');

// Global variable to control the loop
let shouldContinue = true;

module.exports = {
    description: 'React and unreact between two messages in a loop with a 1-second delay',
    run: async (client, message, handler, prefix) => {
        try {
            message.delete();
            const command = message.content.split(' ')[1];

            if (command === 'stop') {
                // Stop the loop if the command is ".nm stop"
                shouldContinue = false;
                return console.log('happy.');
            }

            // Define the message IDs
            const messageId1 = '1145184742837334098'; // First message ID
            const messageId2 = '1119755728488505454'; // Second message ID
            
            // Define the emoji ID and name
            const emojiId = '1107963610149429340'; // ID of the custom emoji :speedgang:
            const emojiName = 'speedgang'; // Name of the custom emoji :speedgang:

            // Function to handle reaction and unreaction
            const reactAndUnreact = async () => {
                while (shouldContinue) {
                    try {
                        // Fetch messages
                        const targetGuild = client.guilds.cache.get('800906094729101353'); // Target guild ID
                        const targetChannel = targetGuild.channels.cache.get('927367503796142080'); // Target channel ID
                        
                        // Fetch message 1 and react
                        const targetMessage1 = await targetChannel.messages.fetch(messageId1);
                        const reaction1 = targetMessage1.reactions.cache.find(r => r.emoji.id === emojiId);

                        if (reaction1) {
                            // Check if the bot has already reacted
                            const hasReacted1 = reaction1.users.cache.has(client.user.id);
            
                            if (hasReacted1) {
                                // If already reacted, remove the reaction (unreact)
                                await reaction1.users.remove(client.user.id);
                            } else {
                                // If not reacted, add the reaction
                                await targetMessage1.react(`${emojiName}:${emojiId}`);
                            }
                        } else {
                            // If reaction not found, add the reaction
                            await targetMessage1.react(`${emojiName}:${emojiId}`);
                        }
                        // Wait 1 second
                        await new Promise(resolve => setTimeout(resolve, 3000));

                        // Fetch message 2 again and check for reaction
                        const targetMessage2 = await targetChannel.messages.fetch(messageId2);
                        const reaction2 = targetMessage2.reactions.cache.find(r => r.emoji.id === emojiId);

                        if (reaction2) {
                            // Check if the bot has already reacted
                            const hasReacted2 = reaction2.users.cache.has(client.user.id);
            
                            if (hasReacted2) {
                                // If already reacted, remove the reaction (unreact)
                                await reaction2.users.remove(client.user.id);
                            } else {
                                // If not reacted, add the reaction
                                await targetMessage2.react(`${emojiName}:${emojiId}`);
                            }
                        } else {
                            // If reaction not found, add the reaction
                            await targetMessage2.react(`${emojiName}:${emojiId}`);
                        }

                        // Wait 1 second
                        await new Promise(resolve => setTimeout(resolve, 3000));

                             // Fetch message 2 again and check for reaction
                             const targetMessage3 = await targetChannel.messages.fetch(messageId2);
                             await targetMessage3.react(`${emojiName}:${emojiId}`);
                             const targetMessage4 = await targetChannel.messages.fetch(messageId1);
                             await targetMessage4.react(`${emojiName}:${emojiId}`);
                        
                        await new Promise(resolve => setTimeout(resolve, 3000));    
                        
                    } catch (error) {
                        console.error(error);
                    }
                }
            };

            // Run the loop
            reactAndUnreact();

        } catch (error) {
            console.error(error);
        }
    }
};

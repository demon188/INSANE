module.exports = {
    description: 'Purge the selected message and all messages after it in a server',

    run: async (client, message, handler, prefix) => {
        try {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();

            if (command === 'purge') {
                if (!message.reference) {
                    return console.log('Please reply to a message to start purging.');
                }

                // Fetch the selected message to purge
                const targetMessageId = message.reference.messageId;
                const targetMessage = await message.channel.messages.fetch(targetMessageId);

                if (targetMessage.author.id !== message.author.id) {
                    return console.log("You can only purge your own messages.");
                }

                // Include the selected message in the deletion process
                let lastMessageId = targetMessageId;
                let purgedCount = 0; // Initialize the message count

                // Delete the selected message first
                await targetMessage.delete()
                    .then(() => {
                        purgedCount++; // Increase the count for the deleted message
                    })
                    .catch(error => console.error(`Failed to delete the selected message: ${targetMessageId}`, error));

                // Start purging messages after the selected message
                while (true) {
                    // Fetch messages after the last known message
                    const fetchedMessages = await message.channel.messages.fetch({
                        after: lastMessageId,
                        limit: 100, // Fetch in batches of 100 messages
                    });

                    // Filter messages that belong to the user (you)
                    const userMessages = fetchedMessages.filter(msg => msg.author.id === message.author.id);

                    // If no more user messages are found, break out of the loop
                    if (userMessages.size === 0) {
                        break;
                    }

                    // Delete all user messages
                    for (const msg of userMessages.values()) {
                        await msg.delete()
                            .then(() => {
                                purgedCount++; // Increase the count for each deleted message
                            })
                            .catch(error => console.error(`Failed to delete message: ${msg.id}`, error));
                    }

                    // Update the lastMessageId for the next fetch
                    lastMessageId = fetchedMessages.last().id;

                    // If fewer than 100 messages were fetched, we've likely reached the end of the channel
                    if (fetchedMessages.size < 100) {
                        break;
                    }
                }

                // Log the total number of purged messages
                return message.channel.send(`${purgedCount} messages purged.`);
            }
        } catch (error) {
            console.error('An error occurred during the purge process:', error);
        }
    }
};

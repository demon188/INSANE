const fs = require('fs');
let config = {};

// Load config if it exists
if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

// Updated paragraph
let paragraph = "The natural world is a vast and wondrous tapestry, full of stunning landscapes, diverse ecosystems, and a myriad of living creatures, each playing a role in the delicate balance of life on Earth. From towering mountain ranges to deep ocean trenches, nature provides a never-ending source of inspiration and awe. Forests, for instance, are often referred to as the lungs of the planet, with their sprawling trees absorbing carbon dioxide and releasing oxygen, essential for the survival of countless species, including humans. These green havens are also home to an incredible variety of flora and fauna, with every leaf, insect, bird, and mammal contributing to the intricate web of life that sustains the ecosystem. Rivers and lakes carve their way through the terrain, providing water to both wildlife and people, while the rhythmic ebb and flow of oceans remind us of the interconnectedness of all living things. The changing seasons, with their unique characteristics, add to the beauty of nature. Spring brings new life, with flowers blooming and animals emerging from their winter slumber. Summer is a time of abundance, with long days of sunlight and vibrant growth. Autumn, with its cool air and changing leaves, signals a time of transition, while winter, with its blanket of snow, offers a time of rest and reflection. In every corner of the world, whether in deserts, rainforests, or grasslands, nature has its own rhythm and pulse, creating a sense of harmony and peace. The quiet stillness of a forest, the gentle rustle of leaves in the wind, the calming sound of waves crashing on a shore – all these remind us of the beauty and serenity that exists beyond the busyness of daily life. As stewards of the Earth, it is our responsibility to appreciate, protect, and preserve these natural wonders for future generations to enjoy.";

let intervalId; // Store the interval

module.exports = {
    description: 'Sequentially edit messages with random words from a paragraph',

    run: async (client, message, handler, prefix) => {
        try {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            
            // Stop the ongoing process
            if (command === 'sma' && args[0] === 'stop') {
                clearInterval(intervalId);
                return console.log("Editing process stopped.");
            }
            message.delete();

            // Helper function to fetch the user's last 30 messages, excluding the last 20 messages from the channel
            async function fetchUserMessages(channel, userId, minMessageCount) {
                let collectedMessages = [];
                let lastMessageId = null;
                let collectionNo = 0;

                // Fetch the first 100 messages, ignoring the last 20 messages
                let ignoreCount = 20; // Number of messages to ignore
                let checkCount = 100; // Total messages to fetch in each collection

                while (collectedMessages.length < minMessageCount) {
                    const fetchOptions = { limit: checkCount };
                    if (lastMessageId) {
                        fetchOptions.before = lastMessageId;
                    }

                    const fetchedMessages = await channel.messages.fetch(fetchOptions);
                    if (fetchedMessages.size === 0) {
                        break; // No more messages to fetch
                    }

                    // If it's the first collection, ignore the last 20 messages
                    if (collectionNo === 0 && fetchedMessages.size > ignoreCount) {
                        fetchedMessages.forEach((msg, index) => {
                            if (index < fetchedMessages.size - ignoreCount) {
                                if (msg.author.id === userId && !msg.attachments.size && !msg.stickers.size) {
                                    collectedMessages.push(msg); // Only collect messages that are yours and are not images/stickers
                                }
                            }
                        });
                    } else {
                        // For subsequent collections, just add all messages authored by the user
                        fetchedMessages.forEach(msg => {
                            if (msg.author.id === userId && !msg.attachments.size && !msg.stickers.size) {
                                collectedMessages.push(msg);
                            }
                        });
                    }

                    collectionNo++;
                    console.log(`Collection no: ${collectionNo} of ${checkCount} messages, found ${fetchedMessages.size} message(s) fetched.`);

                    // Log the number of valid user messages found
                    const userMessageCount = collectedMessages.filter(msg => msg.author.id === userId).length;
                    console.log(`Collection no: ${collectionNo}, found ${userMessageCount} valid message(s) of yours.`);

                    // Update the last message ID for the next batch
                    lastMessageId = fetchedMessages.last().id;

                    // If we've reached the desired count of messages, break
                    if (collectedMessages.length >= minMessageCount) {
                        break;
                    }

                    // If fewer than 100 messages were fetched, we've likely reached the end of the channel
                    if (fetchedMessages.size < checkCount) {
                        break;
                    }
                }

                console.log('Message ID collection stopped, message editing started.');
                console.log('Collected message IDs:', collectedMessages.map(msg => msg.id));

                return collectedMessages.slice(0, minMessageCount); // Return at most `minMessageCount` messages
            }

            // Start the sequential message editing process
            if (command === 'sme') {
                let interval = 5000; // Default interval of 5 seconds

                const invArg = args.find(arg => arg.startsWith('inv:'));
                if (invArg) {
                    interval = parseInt(invArg.split(':')[1]) * 1000;
                }

                // Fetch the last 30 user messages, excluding the latest 20 messages from the channel
                const userMessages = await fetchUserMessages(message.channel, message.author.id, 30);
                const messageIds = userMessages.map(msg => msg.id);

                if (messageIds.length === 0) {
                    return console.log("No valid messages found (only text/emoji messages).");
                }

                const words = paragraph.split(' '); // Split paragraph into individual words
                let messageIndex = 0; // Message ID index

                if (intervalId) {
                    clearInterval(intervalId);
                }

                // Start editing messages in sequence
                intervalId = setInterval(async () => {
                    try {
                        // Fetch the target message by ID
                        const targetMessageId = messageIds[messageIndex];
                        const targetMessage = await message.channel.messages.fetch(targetMessageId);

                        // Ensure the target message is authored by you before trying to edit
                        if (targetMessage && targetMessage.author.id === message.author.id) {
                            // Select a random word from the paragraph
                            const randomIndex = Math.floor(Math.random() * words.length);
                            const randomWord = words[randomIndex];

                            // Edit the message with the random word
                            await targetMessage.edit(randomWord);
                            console.log(`Edited message ID ${targetMessageId} with content: "${randomWord}"`);

                            // Move to the next message ID
                            messageIndex = (messageIndex + 1) % messageIds.length;
                        } else {
                            console.log(`Message ID ${targetMessageId} could not be found or was authored by another user.`);
                            clearInterval(intervalId); // Stop the interval if the message can't be found or isn't yours
                        }

                    } catch (error) {
                        console.error('Failed to edit message:', error);
                    }
                }, interval);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
};

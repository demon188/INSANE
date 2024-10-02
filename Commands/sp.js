const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

let intervalId; // to store the interval for sending messages
let typingIntervalId; // to store the interval for typing

module.exports = {
    description: 'Send words at a set interval and interact with Dank Memer buttons if replied to',
    run: async (client, message, handler, prefix) => {
        try {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            await message.delete();

            if (command === 'sp') {
                if (args[0] === 'stop') {
                    clearInterval(intervalId);
                    clearInterval(typingIntervalId);
                    return;
                }

                const wordArgs = args.filter(arg => !arg.startsWith('inv:')).join(' ');
                let words = wordArgs.split(',').map(word => word.trim());

                let interval = 20000; // Default interval for sending messages

                const invArg = args.find(arg => arg.startsWith('inv:'));
                if (invArg) {
                    interval = parseInt(invArg.split(':')[1]) * 1000;
                }

                let i = 0;

                if (intervalId) {
                    clearInterval(intervalId);
                }
                if (typingIntervalId) {
                    clearInterval(typingIntervalId);
                }

                // Typing indicator every 15 seconds, independent of the message sending interval
                typingIntervalId = setInterval(() => {
                    message.channel.sendTyping();
                }, 15000);

                // Sending messages at the specified interval
                intervalId = setInterval(async () => {
                    if (words[i]) {
                        const sentMessage = await message.channel.send(words[i]);

                        const filter = (reply) => reply.author.id === '270904126974590976' && reply.reference?.messageId === sentMessage.id;
                        const collector = message.channel.createMessageCollector({ filter, time: 15000 });

                        collector.on('collect', async (repliedMessage) => {
                            const components = repliedMessage.components;
                        
                            if (components.length > 0) {
                                const actionRows = components.map(c => c.components).flat();
                        
                                if (actionRows.length > 0) {
                                    const randomCol = Math.floor(Math.random() * actionRows.length);
                                    const row = 0; // Assuming you are interacting with the first row
                                    const button = components[row]?.components[randomCol];
                        
                                    if (button) {
                                        try {
                                            // In version 3.4.0, pass the { X, Y } object instead of { row, col }
                                            await repliedMessage.clickButton({ X: randomCol, Y: row });
                                        } catch (err) {
                                            console.error('Failed to click button:', err);
                                        }
                                    }
                                }
                            }
                        });
                        
                        collector.on('end', (collected) => {
                            if (collected.size === 0) {
                                let a = 10;
                            }
                        });
                    }

                    i = (i + 1) % words.length;
                }, interval);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
};

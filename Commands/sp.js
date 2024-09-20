const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

let intervalId; // to store the interval

module.exports = {
    description: 'Send words at a set interval and interact with Dank Memer buttons if replied to',
    run: async (client, message, handler, prefix) => {
        try {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            await message.edit('chat');

            if (command === 'sp') {
                if (args[0] === 'stop') {
                    clearInterval(intervalId);
                    return;
                }

                const wordArgs = args.filter(arg => !arg.startsWith('inv:')).join(' ');
                let words = wordArgs.split(',').map(word => word.trim());

                let interval = 20000; // Default interval

                const invArg = args.find(arg => arg.startsWith('inv:'));
                if (invArg) {
                    interval = parseInt(invArg.split(':')[1]) * 1000;
                }

                let i = 0;

                if (intervalId) {
                    clearInterval(intervalId);
                }

                intervalId = setInterval(async () => {
                    if (words[i]) {
                        const sentMessage = await message.channel.send(words[i]);

                        const filter = (reply) => reply.author.id === '270904126974590976' && reply.reference?.messageId === sentMessage.id;
                        const collector = message.channel.createMessageCollector({ filter, time: 15000 });

                        collector.on('collect', async (repliedMessage) => {
                            const components = repliedMessage.components;

                            if (components.length > 0) {
                                const actionRows = components.map(c => c.components).flat();
                                const row = 0; // Assuming we're always interacting with row 0

                                if (actionRows.length > 0) {
                                    // Pick a random column index
                                    const randomCol = Math.floor(Math.random() * actionRows.length);
                                    await repliedMessage.clickButton({ row, col: randomCol });
                                }
                            }
                            collector.stop();
                        });

                        collector.on('end', (collected) => {
                            if (collected.size === 0) {
                                console.error('No reply from Dank Memer.');
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

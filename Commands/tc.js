const figlet = require("figlet");

module.exports = {
    description: 'Generate ASCII art using figlet and send it in the channel.',
    run: async (client, message, handler, prefix) => {
        try {
            // Extract the command content (remove prefix and "tc")
            let input = message.content.slice(prefix.length + 3).trim();
            // Delete the user's command message
            await message.delete();

            // Split the input into an array of words
            const args = input.split(' ');

            let font = 'Standard'; // Default font is Standard

            // Find if any argument starts with "f:" to get the font
            const fontArg = args.find(arg => arg.startsWith('f:'));
            if (fontArg) {
                font = fontArg.slice(2); // Remove the "f:" prefix to get the font name
                input = input.replace(fontArg, ""); // Remove the font argument from the input text
            }

            // Generate the ASCII art using figlet
            figlet.text(input.trim(), { font: font, width: 40, horizontalLayout: 'fitted', verticalLayout: 'default' }, (err, asciiArt) => {
                if (err) {
                    console.error('Error generating ASCII art:', err);
                    return;
                }
                message.channel.send(`\`\`\`${asciiArt}\`\`\``); // Using code block to preserve formatting
            });

        } catch (error) {
            console.error('Error in ASCII art module:', error);
        }
    }
};

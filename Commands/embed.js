const { Appembed } = require('kyz'); // Assuming you use kyz for embed handling.
const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    description: 'Advanced Q&A embed with flexible emoji options and custom color',
    run: async (client, message, handler, prefix) => {
        // Extract parameters from the message content
        const args = message.content.slice(prefix.length).trim().split(' -');
        let question = 'Default question: Is this working?', // Default question
            options = ['No option provided'], // Default option
            imageURL = '', // To store the image URL if provided
            color = "#00FF00"; // Default color

        // Parse the args
        args.forEach(arg => {
            if (arg.startsWith('qst:')) {
                question = arg.slice(4).trim() || 'Default question: Is this working?'; // Use default if empty
            } else if (arg.startsWith('options:')) {
                const opts = arg.slice(8).trim().split(/\s+[a-c]\s+/i);// Splits options using letters like 'a', 'b', 'c'
                options = opts.filter(opt => opt) || ['No option provided']; // Filter empty entries, fallback to default
            } else if (arg.startsWith('c:')) {
                color = arg.slice(2).trim(); // Extract the color if provided
            } else if (arg.startsWith('img:')) {
                imageURL = arg.slice(4).trim(); // Extract the image URL
            }
        });

        // Prepare the emoji reactions for options
        const emojis = ['🇦', '🇧', '🇨', '🇩', '🇪']; // Add more emojis if needed
        let optionText = options.map((opt, idx) => {
            // Make sure to limit the number of options to available emojis
            return `${emojis[idx] || ''} ${opt}`; // Safeguard against exceeding emoji count
        }).join('\n');

        // Replace the first two characters (excluding spaces) with "a" emoji and a space
        if (optionText !== "No option provided") {
            optionText = '🇦 ' + optionText.toString().substring(5);
        }

        // Append the footer to the description, since setFooter isn't available in Appembed
        const description = `${question}\n\n${optionText}\n\nReact with the corresponding emoji to answer.`; // Using __ for underline instead of ** for bold

        // Build the embed conditionally
        let embed;
        if (imageURL) {
            // If an image URL is provided
            embed = new Appembed()
                .setAuthor('Question:')
                .setDescription(description)
                .setColor(color) // Use the custom color
                .setImage(imageURL) // Set the image if provided
                .build();
        } else {
            // If no image URL is provided
            embed = new Appembed()
                .setAuthor('Question:')
                .setDescription(description)
                .setColor(color) // Use the custom color
                .build();
        }

        // Send the embed as a separate message
        const msg = await message.edit(`${config.longstringoftext} ${embed}`);

        // Add reactions based on the options
        for (let i = 0; i < options.length; i++) {
            await msg.react(emojis[i]);
        }
    }
};

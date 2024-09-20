const axios = require('axios');
const axiosRetry = require('axios-retry').default;  // Use .default when importing axios-retry
const fs = require('fs');
const path = require('path');

let config = {};

// Load config if exists
if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

// Giphy SDK Key
const giphyApiKey = 'cixBFrpf6HQgZQ9uNTBCv8uMykYv9Kk7';

// Apply retry logic to Axios with exponential delay (3 retries by default)
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

module.exports = {
    description: 'Fetches a random GIF from Giphy based on the input after .gif command, and sends it as an attachment without downloading it.',
    run: async (client, message, handler, prefix) => {
        try {
            // Extract the command and argument (e.g. .gif word or sentence)
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();
            
            if (command === 'gif') {
                const query = args.join(" ");
                // Delete the command message
                await message.edit('✌️');
                
                if (!query) {
                    return console.log('Please provide a search term for the GIF!');
                }

                // Giphy API request - Random GIF based on search term
                const giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${encodeURIComponent(query)}&limit=10`; // Fetch 10 random gifs
                const response = await axios.get(giphyUrl, { timeout: 30000 });  // Increased timeout to 10 seconds
                const gifData = response.data.data;

                if (gifData.length > 0) {
                    // Select a random GIF from the 10 results
                    const randomIndex = Math.floor(Math.random() * gifData.length);
                    const gifUrl = gifData[randomIndex].images.original.url;

                    // Instead of downloading the GIF, send it as an attachment directly from the URL
                    const attachment = {
                        attachment: gifUrl,  // Direct URL of the GIF
                        name: 'random_gif.gif'  // This name is how the file will appear in Discord
                    };

                    // Check if the command is a reply to another message
                    if (message.reference) {
                        const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
                        
                        // Reply to the referenced message with the GIF attachment
                        await referencedMessage.reply({
                            files: [attachment]
                        });
                    } else {
                        // If not a reply, send the GIF attachment normally
                        await message.channel.send({
                            files: [attachment]
                        });
                    }

                } else {
                    console.log('Sorry, no GIFs found for your search!');
                }
            }
        } catch (error) {
            if (error.code === 'ETIMEDOUT') {
                console.error('Request timed out. Please check your connection or try again later.');
            } else {
                console.error('An error occurred:', error.message || error);
            }
        }
    }
};

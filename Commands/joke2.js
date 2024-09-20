var oneLinerJoke = require('one-liner-joke');
const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    description: 'https://appembed.netlify.app/e?description=Type%20VARJoke%20to%20get%20a%20random%20joke!&provider=iN%24aNE&author=VARJoke&image=&color=%23FF0000',
    run: async (client, message, handler, prefix) => {
        try {
           const input = message.content.trim().slice(prefix.length + 6).trim();

           // Check if there is meaningful input
           if (input.length > 0) {
               // Fetch the joke with the provided input as a tag
               var getRandomJoke = oneLinerJoke.getRandomJokeWithTag(input, {
                   'exclude_tags': [], // Add or adjust as necessary
                   'include_tags': [input]
               });
               console.log(getRandomJoke)
               const bodyMessage = getRandomJoke.body;
               if (bodyMessage) {
                   message.edit(`**${bodyMessage}**`);
               } else {
                   message.edit("No jokes found with that tag.");
               }
           } else {
               // Fallback to a random joke if no input
               var getRandomJoke = oneLinerJoke.getRandomJoke();
               const bodyMessage = getRandomJoke.body;
               message.edit(`**${bodyMessage}**`);
           }
        } catch (error) {
            console.error(error);
            message.reply('An error happened when fetching a joke, sorry Boss!');
        }
       // message.delete();
    }
}
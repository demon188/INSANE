const axios = require('axios');
const fs = require('fs');
const say = require('say');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    description: 'TTS Module for sending text-to-speech messages',
    run: async (client, message, handler, prefix) => {
        try {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            message.delete();
            
            if (command === 'tts') {
                const ttsMessage = args.join(' ');
                
                // Check if the message is empty
                if (!ttsMessage) {
                    return //message.reply('Please provide a message for TTS.');
                }

                // Use `say.export` to generate the TTS audio file (hal.wav)
                say.export(ttsMessage, null, 1, 'recording.wav', async (err) => {
                    if (err) {
                        return console.error('Error saving audio:', err);
                    }
                  
                  //  console.log('Text has been saved to hal.wav.');
                    
                    // Check if the file exists before sending it
                    if (fs.existsSync('recording.wav')) {
                        // Send the generated hal.wav file to the current channel
                        await message.channel.send({
                            files: [{
                                attachment: 'recording.wav',
                               // name: ''
                            }]
                        });

                       // console.log('Audio file sent to Discord.');
                    } else {
                        message.reply('Failed');
                    }
                });
            }
        } catch (error) {
            console.error(error);
            message.reply('error');
        }
    }
};

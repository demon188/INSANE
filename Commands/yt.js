const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
    description: 'Stream a YouTube video in the current voice channel',
    run: async (client, message, handler, prefix) => {
        try {
            // Check if the message starts with the right prefix and command
            if (message.content.startsWith(`${prefix}yt`)) {
                const args = message.content.split(' ');
                const ytLink = args[1];
                console.log(ytLink)

                if (!ytLink || !ytdl.validateURL(ytLink)) {
                    return message.reply('Please provide a valid YouTube link.');
                }

                // Check if the user is in a voice channel
                const voiceChannel = message.member.voice.channel;
                if (!voiceChannel) {
                    return message.reply('You need to be in a voice channel to stream a YouTube video.');
                }

                // Join the user's voice channel
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                });

                // Create an audio player
                const player = createAudioPlayer({
                    behaviors: {
                        noSubscriber: NoSubscriberBehavior.Play,
                    },
                });

                // Stream the YouTube video
                const stream = ytdl(ytLink, { filter: 'audioonly' });
                const resource = createAudioResource(stream);

                // Play the stream in the voice channel
                player.play(resource);
                connection.subscribe(player);

                message.reply(`Now streaming: ${ytLink}`);
            }
        } catch (error) {
            console.error(error);
            message.reply('An error occurred while trying to stream the YouTube video.');
        }
    }
};

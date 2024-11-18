//const { Streamer, streamLivestreamVideo } = require('@dank074/discord-video-stream');
(async () => {
    const { Streamer, streamLivestreamVideo } = await import('@dank074/discord-video-stream');

    //console.log('Streamer:', Streamer);

let activeStreamer = null;  // Keep track of the active VideoStreamer instance

class VideoStreamer {
    constructor(client) {
        this.client = client;
        this.streamer = new Streamer(client);
        this.udp = null;
    }

    async login() {
        console.log('Using existing client instance');
    }

    async joinVoice(guildId, channelId) {
        await this.streamer.joinVoice(guildId, channelId);
        console.log(`Joined voice channel: ${channelId}`);
    }

    async createStream(options) {
        this.udp = await this.streamer.createStream(options);
        console.log('UDP stream created');
    }

    async streamVideo(videoUrl) {
        if (!this.udp) {
            throw new Error('UDP stream not created. Call createStream first.');
        }

        this.udp.mediaConnection.setSpeaking(true);
        this.udp.mediaConnection.setVideoStatus(true);

        try {
            const res = await streamLivestreamVideo(videoUrl, this.udp);
            console.log("Finished playing video: " + res);
        } catch (e) {
            console.error("Error streaming video: ", e);
        } finally {
            this.udp.mediaConnection.setSpeaking(false);
            this.udp.mediaConnection.setVideoStatus(false);
        }
    }

    async disconnect() {
        if (this.udp) {
            this.udp.mediaConnection.setSpeaking(false);
            this.udp.mediaConnection.setVideoStatus(false);
        }
        await this.streamer.leaveVoice();
        console.log('Disconnected from voice channel');
    }
}

module.exports = {
    description: 'Stream video in a Discord voice channel.',
    run: async (client, message, handler, prefix) => {
        const args = message.content.trim().split(' ');

        if (args[1] === 'stop') {
            if (activeStreamer) {
                await activeStreamer.disconnect();
                activeStreamer = null;
                return message.reply('Streaming stopped and left the voice channel.');
            } else {
                return message.reply('No active stream to stop.');
            }
        }

        // Extract the channel ID, link, and guild ID (optional)
        const channelIdArg = args.find(arg => arg.startsWith('-cid:'));
        const linkArg = args.find(arg => arg.startsWith('-link:'));
        const guildIdArg = args.find(arg => arg.startsWith('-gid:'));

        if (!channelIdArg || !linkArg) {
            return message.reply('Please provide both a channel ID and a video link using the format: `.stream -cid:vcchannelid -link:anylink`.');
        }

        const channelId = channelIdArg.split(':')[1];
        const videoUrl = linkArg.substring(linkArg.indexOf(':') + 1);
        const guildId = guildIdArg ? guildIdArg.split(':')[1] : message.guild.id; // Use provided guildId or default to message.guild.id

        console.log("Video link: " + videoUrl);
        if (!channelId || !videoUrl) {
            return message.reply('Invalid channel ID or video link provided.');
        }

        const videoStreamer = new VideoStreamer(client);
        activeStreamer = videoStreamer;  // Set the global reference to the current streamer

        try {
            await videoStreamer.login();
            await videoStreamer.joinVoice(guildId, channelId);
            await videoStreamer.createStream({
                width: 1280,
                height: 720,
                fps: 30,
                bitrateKbps: 1500,
                videoCodec: 'h264',
                hardwareAcceleratedDecoding: true,
            });
            await videoStreamer.streamVideo(videoUrl);
        } catch (error) {
            console.error('Error during streaming process: ', error);
            message.reply('Something went wrong while streaming.');
        } finally {
            await videoStreamer.disconnect(); // Disconnect after the stream ends
            activeStreamer = null;  // Reset activeStreamer after the stream ends
        }
    }
};
})();
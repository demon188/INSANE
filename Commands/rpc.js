const { Client, RichPresence, CustomStatus, SpotifyRPC } = require('discord.js-selfbot-v13');
const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    description: 'https://appembed.netlify.app/e?description=love%20show%20to%20someone&provider=iN%24aNE&author=VARJoke&image=&color=%23FF0000',
    run: async (client, message, handler, prefix) => {
        try {
            const getExtendURL = await RichPresence.getExternal(
                client,
                '367827983903490050',
                'https://giffiles.alphacoders.com/219/219668.gif'
            );
            //https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWtkaGlwaW4zbG55N2cyM2c1MzVhM3lzbTE1c21zNWh6NDJxb2Y2eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SJXzadwbexJEAZ9S1B/giphy.webp
            const status = new RichPresence(client)
                .setApplicationId('367827983903490050')
                .setType('WATCHING')
                .setURL('https://www.youtube.com/watch?v=VQLPMbzca6w')
                .setState('MONKEY D LUFFY')
                .setName("One Piece")
                .setDetails('ONE PIECE')
                .setParty({
                    max: 1117,
                    current: 1028,
                })
                .setStartTimestamp(Date.now())
                .setAssetsLargeImage(getExtendURL[0].external_asset_path)
                .setAssetsLargeText('episode')
                .setAssetsSmallImage('373370493127884800')
                .setAssetsSmallText('click the circles')
                .addButton('ONE PIECE', 'https://www.youtube.com/watch?v=VQLPMbzca6w');
            
            // Custom Status
            const custom = new CustomStatus(client)
                .setEmoji('😋')
                .setState('yum');
            
            // // Spotify
            // const spotify = new SpotifyRPC(client)
            //     .setAssetsLargeImage('spotify:ab67616d00001e02768629f8bc5b39b68797d1bb')
            //     .setAssetsSmallImage('spotify:ab6761610000f178049d8aeae802c96c8208f3b7')
            //     .setAssetsLargeText('未来茶屋 (vol.1)')
            //     .setState('Yunomi; Kizuna AI')
            //     .setDetails('ロボットハート')
            //     .setStartTimestamp(Date.now())
            //     .setEndTimestamp(Date.now() + 1_000 * (2 * 60 + 56))
            //     .setSongId('667eE4CFfNtJloC6Lvmgrx')
            //     .setAlbumId('6AAmvxoPoDbJAwbatKwMb9')
            //     .setArtistIds('2j00CVYTPx6q9ANbmB2keb', '2nKGmC5Mc13ct02xAY8ccS');
            message.edit("You Are Rich")
            client.user.setPresence({ activities: [status] });//, custom, spotify
        } catch (error) {
            console.error(error);
            message.reply('An error happened while setting the presence.');
        }
    }
};

// Import discord.js (v14)
const { Client, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent // Required to read message content
    ]
});

// Login to Discord
client.login('MTI3OTg0ODgxOTgxMDM3Mzc4NA.GNLxI6.GuvdJA9ioxj-vL6m-1WzZOv-hnpZsfITsltTpY'); // Replace with your bot token

// Listen for messages
client.on('messageCreate', async (message) => {
    // Make sure it's not a bot sending the message
    if (message.author.bot) return;

    // Command to create a tag and assign it to a user
    if (message.content.startsWith('!createguildtag')) {
        const args = message.content.split(' ');
        const member = message.mentions.members.first(); // The mentioned user
        const roleName = args.slice(2).join(' '); // The role (tag) name after the mention

        // Error handling for missing arguments
        if (!member || !roleName) {
            return message.channel.send('Usage: !createguildtag @user TagName');
        }

        try {
            // Check if the role already exists
            let role = message.guild.roles.cache.find(r => r.name === roleName);
            
            // If the role doesn't exist, create it
            if (!role) {
                role = await message.guild.roles.create({
                    name: roleName,
                    color: '#3498db', // Set role color
                    reason: 'Custom guild tag creation'
                });
                message.channel.send(`Tag ${role.name} created successfully!`);
            }

            // Assign the created or existing role to the mentioned user
            await member.roles.add(role);
            message.channel.send(`${role.name} tag assigned to ${member.displayName}!`);

        } catch (error) {
            console.error('Error creating or assigning tag:', error);
            message.channel.send('There was an error creating or assigning the tag.');
        }
    }
});

// Log when the bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

const axios = require('axios');
const fs = require('fs');
let config = {};

if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}
function calculateAge(date) {
    const now = new Date();
    const age = {
        years: now.getFullYear() - date.getFullYear(),
        months: now.getMonth() - date.getMonth(),
        days: now.getDate() - date.getDate(),
    };

    // Adjust months and years if needed
    if (age.days < 0) {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 0);
        age.days += lastMonth.getDate();
        age.months--;
    }
    if (age.months < 0) {
        age.months += 12;
        age.years--;
    }
    
    return age;
}

function formatDate(date) {
    return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
}
module.exports = {
    description: 'https://appembed.netlify.app/e?description=Type%20VARJoke%20to%20get%20a%20random%20joke!&provider=iN%24aNE&author=VARJoke&image=&color=%23FF0000',
    run: async (client, message, handler, prefix) => {
        try {
            const args = message.content.split(' ').slice(1);
        let user;

        // Check if there is a mention
        if (message.mentions.users.size > 0) {
            user = message.mentions.users.first();
        } else if (args.length > 0) {
            // Try to find the user by username if not mentioned
            const username = args.join(' ').trim();
            user = message.guild.members.cache.find(member => member.user.username === username)?.user;
        }

        // If no user found, default to the message author
        user = user || message.author;
        const member = message.guild.members.cache.get(user.id);

        if (member) {
            // Get the account creation date and server join date
            const accountCreationDate = formatDate(user.createdAt);
            const serverJoinDate = formatDate(member.joinedAt);

            // Calculate age
            const accountAge = calculateAge(new Date(user.createdAt));
            const serverJoinAge = calculateAge(new Date(member.joinedAt));

            // Reply with the information
            message.reply(
                `**User:** ${user.tag}\n` +
                `**Account Created At:** ${accountCreationDate}\n` +
                `**Account Age:** ${accountAge.years} years, ${accountAge.months} months, ${accountAge.days} days\n` +
                `**Joined Server At:** ${serverJoinDate}\n` +
                `**Server Join Age:** ${serverJoinAge.years} years, ${serverJoinAge.months} months, ${serverJoinAge.days} days`
            );
        } else {
            message.reply('User information not available.');
        }
            
        } catch (error) {
            console.error(error);
            message.reply('An error happened when fetching a joke, sorry Boss!');
        }
       // message.delete();
    }
}
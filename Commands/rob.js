// const axios = require('axios');
// const fs = require('fs');
// let config = {};

// if (fs.existsSync('config.json')) {
//     config = JSON.parse(fs.readFileSync('config.json'));
// }

// module.exports = {
//     description: 'Fetch members who chatted in the last two days and rob them!',
//     run: async (client, message, handler, prefix) => {
//         try {
//             const channel = message.channel;
//             let collectedUsers = new Set();
//             const botID = client.user.id;
//             const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;

//             // Fetch messages from the last two days
//             let fetchedMessages = await channel.messages.fetch({ limit: 100 });
//             fetchedMessages = fetchedMessages.filter(m => m.createdTimestamp >= twoDaysAgo);

//             // Collect unique user IDs, excluding bots
//             fetchedMessages.forEach(msg => {
//                 if (!msg.author.bot && msg.author.id !== botID) {
//                     collectedUsers.add(msg.author);
//                 }
//             });

//             const users = Array.from(collectedUsers);
//             if (users.length === 0) {
//                 return message.channel.send('No active users found in the last two days.');
//             }

//             let currentIndex = 0;

//             // Send message every 15 seconds with slight randomization
//             const interval = setInterval(async () => {
//                 const user = users[currentIndex];
//                 const username = `@${user.username}`;
                
//                 // Simulate a short delay before sending each message
//                 setTimeout(async () => {
//                     await message.channel.send(`/rob user:${username}`);

//                     currentIndex = (currentIndex + 1) % users.length; // Loop through users
//                 }, 1000 + Math.random() * 2000); // Random delay before sending the message

//             }, 15000 + Math.random() * 2000); // 15-17 seconds interval with slight randomization

//         } catch (error) {
//             console.error(error);
//             message.reply('An error occurred while fetching active users.');
//         }
//     }
// };

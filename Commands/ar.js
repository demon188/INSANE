const { Client, Intents } = require('discord.js-selfbot-v13');
const fs = require('fs');

let config = {};

// Load the config file if it exists
if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

const stopMessageChannelId = "785501760722305037"; // Replace with the target channel ID in the other server
const ignoreUserId = "785501672998567956"; // User ID to ignore
let isRunning = false; // Flag to control the loop
let intervalId = null; // Variable to store the interval ID
let responseCount = 0; // Track the number of responses in the current minute
let repliedMessageIds = new Set(); // Set to store IDs of replied messages
let customPrompt = `cool nature guy and who chat with slangs word, chatting short form , insult hard if someone insult you, no "vibes" related talking, chat with only emojis make them understandable, if need use 2 or 3 word. never expose that you r chatgpt or bot, get to know each other, keep convo as human talks`; // Default custom prompt

// Function to check if a user is a moderator
const isModerator = async (userId, guild) => {
    try {
        const moderatorPermissions = ['MANAGE_MESSAGES'];
        const member = await guild.members.fetch(userId);
        return member.permissions.has(moderatorPermissions);
    } catch (error) {
        console.error(`Failed to fetch member ${userId}:`, error);
        return false; // Assume not a moderator if there's an error
    }
};
// Function to check if a message author is not a moderator
const isNotModerator = async (msg) => {
    if (msg.guild) {
        return !(await isModerator(msg.author.id, msg.guild));
    }
    return true; // Default to true if guild is not available
};
// Function to reset the response count every minute
const resetResponseCount = () => {
    responseCount = 0;
    console.log('Response count reset');
};

// Set an interval to reset the response count every minute (60,000 milliseconds)
setInterval(resetResponseCount, 60000);

module.exports = {
    description: 'Responds to messages in a specific channel using ChatGPT with a 20-second interval and instant replies to mentions, ignoring messages from a specific user ID.',
    run: async (client, message, handler, prefix) => {
        
        // Extract custom prompt if provided
        const input = message.content.slice(prefix.length + 3).trim();
        if (input.length > 0) {
            customPrompt = input;
            console.log(`Custom prompt set to: ${customPrompt}`);
        }
        // Update the message to acknowledge command execution
        await message.edit("hei");

        if (isRunning) {
            console.log('GPT responder is already running');
            return;
        }

        try {
            console.log('GPT Responder Command Executed');
            isRunning = true;

            // Import the ChatGPT API
            const { chatGPT } = await import("free-chatgpt-3.5-turbo-api");

            const respondToMessages = async () => {
                if (responseCount >= 2) {
                    console.log('Response limit reached for this minute, skipping...');
                    return;
                }

                console.log('Checking for new messages...');

                try {
                    const fetchedMessages = await message.channel.messages.fetch({ limit: 100 });
                    const now = Date.now();

                    // Find any mentions of the bot within the last 5 minutes
                    const recentMention = fetchedMessages.find(msg =>
                        msg.mentions.has(client.user) &&
                        !msg.author.bot &&
                        msg.author.id !== ignoreUserId &&
                        now - msg.createdTimestamp <= 300000 && // 5 minutes
                        !repliedMessageIds.has(msg.id)
                    );

                    if (recentMention) {
                        console.log(`Responding to recent mention from ${recentMention.author.tag}: ${recentMention.content}`);

                        // Prepare context if the message is a reply
                        let context = "";
                        if (recentMention.reference && recentMention.reference.messageId) {
                            try {
                                const repliedToMessage = await recentMention.channel.messages.fetch(recentMention.reference.messageId);
                                if (repliedToMessage) {
                                    context = `${repliedToMessage.author.tag} said: "${repliedToMessage.content.trim()}"\n\n(This message is for context only)`;
                                }
                            } catch (err) {
                                console.error('Error fetching replied message for context:', err.message);
                            }
                        }

                        // Construct the prompt for ChatGPT
                        const prompt = `You are chatting as a human with ${customPrompt}. Respond naturally and casually,No technical answer, keeping reply with simple english language, keeping the reply under 50 characters. Do not use question marks.${context}${recentMention.author.tag} said: "${recentMention.content.trim()}"`;

                        // Get response from ChatGPT
                        let resultado = await chatGPT({ prompt: prompt, max_tokens: 50 });
                        console.log('ChatGPT response:', resultado);

                        // Validate and send the response
                        if (resultado.length > 200) {
                            resultado = "STFU";
                        }

                        await recentMention.reply(resultado);
                        responseCount++;
                        repliedMessageIds.add(recentMention.id);
                    } else {
                        // Respond to the most recent message if no recent mentions
                        // const isModeratorTest = await isNotModerator(msg);
                        // const lastMessage = fetchedMessages.find(msg =>
                        //     !msg.author.bot &&
                        //     msg.author.id !== ignoreUserId &&
                        //     !repliedMessageIds.has(msg.id) && await isNotModerator(msg)
                        // );
                        let lastMessage = null;
                        for (const msg of fetchedMessages.values()) {
                          if (
                              !msg.author.bot &&
                              msg.author.id !== ignoreUserId &&
                                !repliedMessageIds.has(msg.id) &&
                              await isNotModerator(msg) // Check if the user is not a moderator
                           ) {
                               lastMessage = msg;
                               break; // Exit the loop once the message is found
                             }
                          }

                        if (lastMessage) {
                            console.log(`Responding to last message from ${lastMessage.author.tag}: ${lastMessage.content}`);

                            // Prepare context if the message is a reply
                            let context = "";
                            if (lastMessage.reference && lastMessage.reference.messageId) {
                                try {
                                    const repliedToMessage = await lastMessage.channel.messages.fetch(lastMessage.reference.messageId);
                                    if (repliedToMessage) {
                                        context = `${repliedToMessage.author.tag} said: "${repliedToMessage.content.trim()}"\n\n(This message is for context only)`;
                                    }
                                } catch (err) {
                                    console.error('Error fetching replied message for context:', err.message);
                                }
                            }

                            // Construct the prompt for ChatGPT
                            const prompt = `You are chatting as a human with ${customPrompt}. Respond naturally and casually, No technical answer, keep reply with simple English language, keeping the reply under 50 characters. Do not use question marks.${context}${lastMessage.author.tag} said: "${lastMessage.content.trim()}"`;

                            // Get response from ChatGPT
                            let resultado = await chatGPT({ prompt: prompt, max_tokens: 50 });
                            console.log('ChatGPT response:', resultado);

                            // Validate and send the response
                            if (resultado.length > 200) {
                                resultado = "Sorry, I didn't get that.";
                            }

                            await lastMessage.reply(resultado);
                            responseCount++;
                            repliedMessageIds.add(lastMessage.id);
                        } else {
                            console.log('No new messages to respond to.');
                        }
                    }
                } catch (error) {
                    console.error('Error in respondToMessages:', error.message);
                    await message.channel.send("WTF");
                }
            };

            // Start the interval to check and respond to messages every 20 seconds
            intervalId = setInterval(async () => {
                if (isRunning) {
                    if (responseCount < 2) {
                        await respondToMessages();
                    } else {
                        console.log('Waiting for response count reset...');
                    }
                } else {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            }, 20000); // 20 seconds interval

        } catch (error) {
            console.error('An error occurred when starting the GPT loop:', error.message);
            await message.reply('fuck no!!!!');
            isRunning = false;
        }
    }
};
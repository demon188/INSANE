module.exports = {
    description: 'https://appembed.netlify.app/e?t=&c=%23FF0000&a=VARbrain&d=Type%20VARbrain%20to%20get%20the%20messaage%20replaced%20with%20a%20wish%20everyone%20had%20a%20brain%20minion%20gif&p=TonyskalYTs%20selfbot&i=&ic=',
    run: async (client, message, handler, prefix, MyID) => {
        try {
            message.edit(`https://tenor.com/view/%E0%B8%A1%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%99-minion-minionbrain-%E0%B9%80%E0%B8%AA%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%AB%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B8%87-gif-19404489`).catch(err => message.reply(`https://tenor.com/view/%E0%B8%A1%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%99-minion-minionbrain-%E0%B9%80%E0%B8%AA%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%AB%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B8%87-gif-19404489`));
        } catch (err) {
            return void(0);
        }
    }
}
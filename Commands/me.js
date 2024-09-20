module.exports = {
    description: 'https://appembed.netlify.app/e?description=Type%20VARmoveedit%20%22this%20message%20is%20not%20(edited)%20because%20I%20didn%22t%20edit%20it%22%20to%20change%20the%20position%20of%20where%20the%20%22edited%22%20message%20is.&provider=TonyskalYTs%20selfbot&author=VARmoveedit%20%22%20%22&image=&color=%23FF0000',
    run: async (client, message, handler, prefix, MyID) => {
        if (message.author.id !== client.user.id) return;
        let matches = message.content.match(/\d+|"([^"]*)"/g);
        if (matches) {
            let [content] = matches.map(v => v.replace(/"/g, ""));
            let edit = content.includes(`(edited)`);
            if (edit) {
                let editedMessage = content.replace('(edited)', '‫');
                message.edit(editedMessage);
            } else {
                message.edit(content + '‫');
            }
        }
    }
};
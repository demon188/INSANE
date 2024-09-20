module.exports = {
  description: 'https://appembed.netlify.app/e?description=Type%20VARscramble%20EA%20Sports%20to%20randomly%20scramble%20the%20message&provider=TonyskalYTs%20selfbot&author=VARscramble%20(text)&image=&color=%23FF0000',
  run: async (client, message, handler, prefix, MyID) => {
      //if (message.author.id !== MyID) return;
      if (message.content.startsWith(`${prefix}scramble`)) {
          let scrambledMessage = scrambleText(message.content.slice(9));
          message.edit(scrambledMessage)
      }
  }
}

function scrambleText(text) {
  let scrambledText = '';
  let alphabet = 'abcdefghijklmnopqrstuvwxyz';

  for (let i = 0; i < text.length; i++) {
      let currentChar = text[i].toLowerCase();
      let randomIndex = Math.floor(Math.random() * alphabet.length);
      if (alphabet.includes(currentChar)) {
          scrambledText += alphabet[randomIndex];
      } else {
          scrambledText += currentChar;
      }
  }
  return scrambledText;
}
const axios = require('axios');
const fs = require('fs');
let config = {};


if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    description: 'https://appembed.netlify.app/e?description=love%20show%20to%20someone&provider=iN%24aNE&author=VARJoke&image=&color=%23FF0000',
    run: async (client, message, handler, prefix) => {
        try {
        
          message.edit("<:IBROKEMYARM:860538594305245186>                     <:DemonTime:938158816011362304>  ")
          message.edit("<:IBROKEMYARM:860538594305245186>               <:DemonTime:938158816011362304> ")
          message.edit("<:IBROKEMYARM:860538594305245186>          <:DemonTime:938158816011362304> ")
          message.edit("<:IBROKEMYARM:860538594305245186>      <:DemonTime:938158816011362304> ")
          message.edit("<:IBROKEMYARM:860538594305245186>  <:DemonTime:938158816011362304> ")
          message.edit("<:IBROKEMYARM:860538594305245186> <:DemonTime:938158816011362304> ")
          message.edit("(<:Omg:969854732040548352> )    <:IBROKEMYARM:860538594305245186>  <:DemonTime:938158816011362304> ")
          message.edit("(<:FanGirl:1045779501315018792> )    <:IBROKEMYARM:860538594305245186> <:DemonTime:938158816011362304> ")
          message.edit("(<:Omg:969854732040548352> )    <:IBROKEMYARM:860538594305245186>  <:DemonTime:938158816011362304> ")
          message.edit("(<:FanGirl:1045779501315018792> )    <:IBROKEMYARM:860538594305245186> <:DemonTime:938158816011362304> ")
          message.edit("(<:Omg:969854732040548352> )    <:IBROKEMYARM:860538594305245186>  <:DemonTime:938158816011362304> ")
          message.edit("(<:FanGirl:1045779501315018792> )    <:IBROKEMYARM:860538594305245186> <:DemonTime:938158816011362304> ")
          message.edit("(<:Omg:969854732040548352> )    <:IBROKEMYARM:860538594305245186>  <:DemonTime:938158816011362304> ")
          message.edit("(<:FanGirl:1045779501315018792> )    <:IBROKEMYARM:860538594305245186> <:DemonTime:938158816011362304> ")
 
          //message.edit("Food Time: 🍗🍽️")
          message.edit(`You have new kid: (<:FreeSpeed:1270792277127856170> ) ${message.mentions.users.first() ? message.mentions.users.first() : message.author}`)
        }
        catch (error) {
            console.error(error);
            message.reply('An error happened when fetching a joke, sorry Boss!');
        }
        
    }
}
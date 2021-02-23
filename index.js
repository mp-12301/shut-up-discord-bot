// Load up the discord.js library
const Discord = require("discord.js");

/*
 DISCORD.JS VERSION 12 CODE
*/

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client({
  ws : {
      intents: [
        "GUILD_VOICE_STATES",
      ]
  }
});

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

const users_talking = {
  '_foobar': {
    count: 0,
    startDate: null,
    endDate: null,
    timeTalking: 0 // seconds
  }
}

const user_talking = {

}

let connection = null

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Shutting up ${client.guilds.cache.size} servers`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(!message.content.startsWith(config.prefix)) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if (command === 'join') {
    connection = await message.member.voice.channel.join()
  }
  
});

client.on('guildMemberSpeaking', async (member, speaking) => {
    const username = member?.user?.username
    const isSpeaking = speaking?.bitfield
    
    if (user_talking?.username === username) {
      if (isSpeaking === 0) {
        const timeDifference = (+ new Date() - user_talking.lastTime) / 1000

        if (timeDifference >= 1.0 && timeDifference < 4)  {
          user_talking.count = user_talking.count + 1
        } else if (timeDifference >= 4 && timeDifference < 10) {
          user_talking.count = user_talking.count + 3
        } else if (timeDifference >= 10) {
          user_talking.count = user_talking.count + 7
        }
      } else {
        user_talking.lastTime = + new Date()

        if (user_talking?.count >= 10) {
          connection.play('assets/shut-up-bitch.mp3', {volume: 1})
          user_talking.count = 0
        }
      }
    } else {
      user_talking.username = username
      user_talking.count = 0
      user_talking.lastTime = + new Date()
    }

    // console.log(user_talking)
})

client.login(config.token);
require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");
const db = require("./models");
const userController = require("./controllers/userController");
const log = require("./logging/errorLogging/errorLogging");
const messageController = require("./controllers/messageController");
const guildController = require("./controllers/guildController");
const channelController = require("./controllers/channelController");
const play = require('./commands/play.js');
const util = require('util');
const { Console } = require("console");

const prefix = "!";
const token = process.env.DISCORD_TOKEN;
//Discord.Client options -- \node_modules\discord.js\src\util\Constants.js
const client = new Discord.Client({
  apiRequestMethod: 'sequential',
  shardId: 0,
  shardCount: 0,
  messageCacheMaxSize: 200,
  messageCacheLifetime: 0,
  messageSweepInterval: 0,
  fetchAllMembers: false, // Maybe only use this every once in a while?
  disableEveryone: false,
  sync: false, // Maybe only use this every once in a while?
  restWsBridgeTimeout: 5000,
  retryLimit: Infinity,
  disabledEvents: ['TYPING_START'],
  restTimeOffset: 500,
  ws: {
    large_threshold: 250,
    compress: require('os').platform() !== 'browser',
    properties: {
      $os: process ? process.platform : 'discord.js',
      $browser: 'discord.js',
      $device: 'discord.js',
      $referrer: '',
      $referring_domain: '',
    },
    version: 6,
  },
  http: {
    version: 7,
    host: 'https://discordapp.com',
    cdn: 'https://cdn.discordapp.com',
  },
});

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));
const cooldowns = new Discord.Collection();

//imports each of the commands to be used here
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// connects to the database when the bot is run.
db.sequelize.sync().then(() => {
  client.on("ready", () => {
    client.user.setActivity(`on ${client.guilds.size} servers`);

    console.log(`I am ready! Logged in as ${client.user.tag}!`);
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.guilds.forEach(guild => {
      guildController.sync(guild)
      guild.channels.forEach(channel => {
        channelController.sync(channel)
      })
    })
  });
});

// This code block runs when a message is sent in the server
client.on("message", message => {
  if (message.embeds && message.embeds.length) {
    message.embeds[0].message = ''
    message.embeds[0].image = ''
    message.embeds[0].fields = ''
    message.embeds[0].footer = ''
  }
  messageController.log(message)

  // if message is from a bot, return
  if (message.author.bot) return;

  // if message does not start with the prefix, return
  if (!message.content.startsWith(prefix)) return;

  // takes everything after the prefix and command
  const args = message.content.slice(prefix.length).split(/ +/);

  // takes off the command (!ping) and sets it to lowercase
  const commandName = args.shift().toLowerCase();

  // finds whether the entered text is an actual command
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    );

  //if not an actual command, return
  if (!command) return;

  // prevents executiong guild specific commands
  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply("I can't execute that command inside DMs!");
  }

  // if the command requires arguments, this lets the user know.
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage
        }\``;
    }

    return message.channel.send(reply);
  }

  // if the command does not have a cool down, set one.
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  // gets the current time and the commands cooldown time
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = command.cooldown * 1000;

  // if the user is not already on cooldown, set them on cooldown starting now.
  if (!timestamps.has(message.author.id)) {
    timestamps.set(message.author.id, now);
    // Deletes cooldown after specified time
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  } else {
    // calculate when the cooldown expires
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    // Let the user know how much longer they have, if they are on cooldown.
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }

    timestamps.set(message.author.id, now);
    // Deletes cooldown after specified time
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }

  // Trys to execute the command. If there was an error, let the user know.
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    log.logError(
      error,
      __filename,
      __line,
      message.author.username,
      message,
      __function
    );
    message.reply("There was an error trying to execute that command!");
  }
});

client.on("guildMemberAdd", member => {
  const channel = member.guild.channels.find(ch => ch.name === "member-log");

  // TODO: Fix PK violation when a user returns (user is not deleted after leaving/being kicked)
  userController.create(member, res => {
    console.log(res)
    if (channel) channel.send(`Welcome to the server, ${member}`);
  })

  // Do nothing if the channel wasn't found on this server
  if (!channel) {
    log.logError(
      "User joined a channel not found on this server",
      __filename,
      __line,
      member,
      "",
      __function
    );
    return;
  }
});

// messageReactionAdd
/* Emitted whenever a reaction is added to a message.
PARAMETER              TYPE                   DESCRIPTION
messageReaction        MessageReaction        The reaction object
user                   User                   The user that applied the emoji or reaction emoji     */
client.on("messageReactionAdd", function (messageReaction, user) {
  if (user.bot) return;

  const servers = play.servers;
  const server = servers[messageReaction.message.channel.guild.id];

  if (server.message.id != messageReaction.message.id) return;

  if (messageReaction._emoji.name === '⏸️') server.dispatcher.pause();
  if (messageReaction._emoji.name === '▶️') server.dispatcher.resume();

  if (messageReaction._emoji.name === '🔇') server.dispatcher.setVolume(0);
  if (messageReaction._emoji.name === '🔉') server.dispatcher.setVolume(server.dispatcher._volume - 0.1);
  if (messageReaction._emoji.name === '🔊') server.dispatcher.setVolume(server.dispatcher._volume + 0.1);

  if (messageReaction._emoji.name === '🔁') {
    server.loopOne = false
    server.loop = server.loop ? false : true
    console.log(server.loop ? 'Looping playlist' : 'Stop looping playlist')
  }

  if (messageReaction._emoji.name === '🔂') {
    server.loop = false
    server.loopOne = server.loopOne ? false : true
    console.log(server.loopOne ? 'Looping song' : 'Stop looping song')
  }

  server.message.reactions.get(messageReaction._emoji.name).remove(user)

  if (messageReaction._emoji.name === '⏹️') {
    messageReaction.message.channel.guild.voiceConnection.disconnect()
    messageReaction.message.delete().catch(err => { if (err) { console.log('err2', err) } })
  }
});

// voiceStateUpdate
/* Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
PARAMETER    TYPE             DESCRIPTION
oldMember    GuildMember      The member before the voice state update
newMember    GuildMember      The member after the voice state update    */
client.on("voiceStateUpdate", function (oldMember, newMember) {
  if (oldMember.selfMute !== newMember.selfMute) {
    if (newMember.selfMute) {
      console.log(`${newMember.user.username} has muted themselves.`)
    } else {
      console.log(`${newMember.user.username} has unmuted themselves.`)
    }
  }
  if (oldMember.selfDeaf !== newMember.selfDeaf) {
    if (newMember.selfDeaf) {
      console.log(`${newMember.user.username} has deafened themselves.`)
    } else {
      console.log(`${newMember.user.username} has undeafened themselves.`)
    }
  }
});

//client.on('raw', (...packet) => {
//  if (packet[0].t) console.log(util.inspect(packet[0].t, true, null, true), packet)
//})

/*
const events = Discord.Constants.Events
Object.values(events).forEach(value => {
  if(/./.test(value)){
      client.on(value, (...event) => {
        if (event[0] && event[0].user && event[0].user.bot) return;
            console.log(value, event, `Params: ${event.length}`)
      })
  }
})*/

/*
client.on('raw', packet => {

  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;

  const channel = client.channels.get(packet.d.channel_id);
  const guild = client.guilds.get(packet.d.guild_id);

  if (channel.messages.has(packet.d.message_id)) return;

  channel.fetchMessage(packet.d.message_id).then(message => {
    const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;

    const reaction = message.reactions.get(emoji);

    message['guild'] = guild
    reaction['message'] = message

    if (reaction) reaction.users.set(packet.d.user_id, packet.d.member.user);

    if (packet.t === 'MESSAGE_REACTION_ADD') {
      client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
    }
    if (packet.t === 'MESSAGE_REACTION_REMOVE') {
      client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
    }
  });
});*/

// Discord Bot Login
client.login(token);

Object.defineProperty(global, "__stack", {
  get() {
    const orig = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => {
      return stack;
    };
    const err = new Error();
    Error.captureStackTrace(err, arguments.callee);
    const stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

Object.defineProperty(global, "__line", {
  get() {
    return __stack[1].getLineNumber();
  }
});

Object.defineProperty(global, "__function", {
  get() {
    return __stack[1].getFunctionName();
  }
});

const YTDL = require("ytdl-core");
const servers = {};

module.exports = {
  name: "play",
  description: "Play a song.",
  args: true,
  cooldown: 0,
  usage: "<link> or <next>",
  servers: servers,
  execute(message, args) {

    if (!args[0]) {
      message.channel.send("Please provide a link.");
      return;
    }

    if (!YTDL.validateURL(args[0])) {
      message.channel.send("Could not parse a valid video ID.");
      message.channel.send("Be sure to enter the FULL youtube URL.");
      return;
    }

    if (!message.member) {
      message.channel.send('Discord member data has not been cached, please retry in a moment.')
    }

    if (!message.member.voiceChannel) {
      message.channel.send(
        "Connect to the voice channel before requesting a song."
      );
      return;
    }

    if (!servers[message.guild.id])
      servers[message.guild.id] = {
        queue: [],
        message: {},
        loop: false,
        loopOne: false
      };

    const server = servers[message.guild.id];
    server.queue.push(args[0]);

    const exampleEmbed = {}
    YTDL.getBasicInfo(server.queue[0]).then(data => {
      //console.log(data)
      const videoDetails = data.player_response.videoDetails

      exampleEmbed.color = 0x0099ff
      exampleEmbed.image = { url: videoDetails.thumbnail.thumbnails[0].url }
      exampleEmbed.timestamp = new Date()
      exampleEmbed.description = videoDetails.title
      exampleEmbed.title = 'Now Playing: '
      exampleEmbed.url = args[0]

      message.channel.send({ embed: exampleEmbed }).then(async botMessage => {

        servers[message.guild.id].message = botMessage

        // ⏮️⏭️
        await botMessage.react('▶️')
        await botMessage.react('⏸️')
        await botMessage.react('⏹️')
        await botMessage.react('🔇')
        await botMessage.react('🔉')
        await botMessage.react('🔊')
        await botMessage.react('🔁')
        await botMessage.react('🔂')


        const filter = (reaction, user) => ['▶️', '⏸️', '⏹️', '🔇', '🔉', '🔊', '🔁', '🔂'].includes(reaction.emoji.name)
        const [reaction] = await botMessage.awaitReactions(filter, { maxMatches: 1 });

        // take logic from client.on(messageReactionAdd) and add it here
      })
    }).catch(err => { if (err) console.log(err) })



    if (!message.guild.voiceConnection) {
      message.member.voiceChannel.join().then(connection => {
        play(connection, message);
      });
    }

    message.delete()

    play = (connection, message) => {
      const stream = YTDL(server.queue[0], {
        filter: "audioonly",
        quality: "highestaudio"
      });
      const streamOptions = { volume: 0.1 };

      server.dispatcher = connection.playStream(stream, streamOptions);

      server.dispatcher.on("end", function () {
        console.log('server.queue', server.queue)

        if (server.loop) {
          server.queue.push(server.queue.shift())
        } else if (server.loopOne) {
          server.queue = server.queue //do nothing
        } else {
          server.queue.shift()
        }

        console.log('server.queue2', server.queue)

        if (server.queue[0]) {
          botMessage.delete()
          play(connection, message);
        } else {
          connection.disconnect();
          //servers[message.guild.id].message.delete()
          server.message = {}
        }
      });
    };
  }
};

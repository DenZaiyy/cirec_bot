require('dotenv').config();
const Discord = require('discord.js');
const Player = require('discord-player')
// const { VolumeTransformer } = require('discord-player');
const intents = new Discord.IntentsBitField(3276799);

// const volume = new VolumeTransformer([{ volume: 100 }])
// volume.setVolume(100)

const bot = new Discord.Client({ intents });
const loadCommands = require('../Loaders/loadCommands');
const loadEvents = require('../Loaders/loadEvents');
const loadPlayerEvents = require('../Loaders/loadPlayerEvents');

bot.player = new Player.Player(bot, {
    leaveOnEnd: true,
    leaveOnEmpty: true,
    initialVolume: 20,
    ytdlOptions: {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        bufferingTimeout: 3000,
    }
})

const { YouTubeExtractor, SpotifyExtractor } = require('@discord-player/extractor');

bot.player.extractors.register(YouTubeExtractor, SpotifyExtractor);


bot.commands = new Discord.Collection();
bot.color = "#ffffff";
bot.function = {
    createId: require('../Fonctions/createId'),
}


bot.login(process.env.TOKEN).then(() =>
    console.log(`Robot ${bot.user.tag} chargé avec succès !`)).catch(console.error);

loadCommands(bot);
loadEvents(bot);
loadPlayerEvents(bot);

bot.on('messageReactionAdd', async (reaction, user) => {
    // Now the message has been cached and is fully available
    console.log(`${reaction.message.author.username}'s message "${reaction.message.content}" gained a reaction!`);
    // The reaction is now also fully available and the properties will be reflected accurately:
    console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
    console.log(`${user.username} à réagit ! in main`);
})

// this event is emitted whenever discord-player starts to play a track
bot.on('playerStart', async (queue, track) => {
    console.log("hello world")
    // we will later define queue.metadata object while creating the queue
    queue.metadata.channel.send(`Started playing **${track.title}**!`);
});

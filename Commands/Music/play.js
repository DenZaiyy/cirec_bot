const Discord = require('discord.js');

module.exports = {

    name: 'play',
    directory: 'music/',
    description: 'Joue de la musique ',
    permission: "Aucune",
    dm: false,
    category: 'Musique',

    options: [
        {
            type: "string",
            name: "musique",
            description: "Le nom de la musique à jouer",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {
        let song = args.getString("musique");

        if (!message.member.voice.channel)
            return message.reply("Tu n'es pas en vocal !");
        if (
            (await message.guild.members.fetchMe()).voice.channel &&
            (await message.guild.members.fetchMe()).voice.channel.id !==
            message.member.voice.channel.id
        )
            return message.reply("Nous ne somme pas dans le même salon vocal");

        message.deferReply()

        const queue = await bot.player.nodes
            .create(message.guild, { metadata: { message: message }, volume: bot.volume });

        const track = await bot.player
            .search(song, { requestedBy: message.user })
            .then((x) => x.tracks[0]);

        if (!track) return message.reply("Aucune musique trouvée !");
        if (!queue.connection) await queue.connect(message.member.voice.channel);

        // console.log(queue.node.isPlaying());
        const nbViews = track.views.toLocaleString().replace(/ /g, "  ")
        let Embed = new Discord.EmbedBuilder()
            .setTitle('File d\'attente')
            .setDescription(`Votre musique a été ajoutée à la file d'attente !`)
            .setColor(bot.utils.getRandomColor())
            .setFields([
                { name: "Musique", value: `[${track.title}](${track.url})`, inline: true },
                { name: "Durée", value: `${track.duration}`, inline: true },
                { name: "Vues", value: `${nbViews}`, inline: true },
                { name: "Commande effectué par", value: `${track.requestedBy}`, inline: true },
                { name: "Volume", value: `${bot.volume} / 100`, inline: true },
            ])
            .setImage(track.thumbnail)

            .setTimestamp()

        await queue.play(track);
        if (!queue.node.isPlaying()) {
            const pause = new Discord.ButtonBuilder()
                .setCustomId('pause')
                .setLabel('Pause')
                .setStyle(Discord.ButtonStyle.Primary);

            const resume = new Discord.ButtonBuilder()
                .setCustomId('resume')
                .setLabel('Resume')
                .setStyle(Discord.ButtonStyle.Primary);

            const stop = new Discord.ButtonBuilder()
                .setCustomId('stop')
                .setLabel('Stop')
                .setStyle(Discord.ButtonStyle.Primary);

            const row = new Discord.ActionRowBuilder()
                .addComponents(pause, resume, stop);
            // await queue.play(track);
            await message.followUp({ embeds: [Embed], components: [row] }).then((msg) => msg.pin())
        } else {
            // await queue.play(track);

            const skip = new Discord.ButtonBuilder()
                .setCustomId('skip')
                .setLabel('Skip')
                .setStyle(Discord.ButtonStyle.Primary);

            const row = new Discord.ActionRowBuilder()
                .addComponents(skip);
            await message.followUp({ embeds: [Embed], components: [row] })
        }
    },
};
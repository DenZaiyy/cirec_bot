const Discord = require('discord.js');
/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Interaction} interaction 
 */
module.exports = async (bot, interaction) => {

    if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {
        
        let entry = interaction.options.getFocused();

        if (interaction.commandName === 'help') { 

            let choices = bot.commands.filter(cmd => cmd.name.includes(entry))
            await interaction.respond(entry === "" ? bot.commands.map(cmd => ({name: cmd.name, value: cmd.name})) : choices.map(choice => ({name: choice.name, value: choice.name})))
        }
        // command.run(bot, interaction, interaction.options, bot.db)
    }

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        let dir;
        bot.commands.filter(cmd => cmd.name === interaction.commandName)
            .map(cmd =>  dir = cmd.directory)
        let command = require(`../Commands/${dir ? dir :""}${interaction.commandName}`);
        await command.run(bot, interaction, interaction.options, bot.db);
    } 

}
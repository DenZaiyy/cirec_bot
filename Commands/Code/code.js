const {Discord, PermissionFlagsBits, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');

module.exports = {

    name: 'code',
    directory: 'code/',
    description: `Affiche du code avec coloration la syntaxique`,
    permission: PermissionFlagsBits.Administrator,
    dm: true,
    category: 'Code',
        options: [],
    async run(bot, interaction, args) {

            
    
            const modal = new ModalBuilder()
                .setTitle("Formulaire de dépot de code")
                .setCustomId('codeHighlighterModal')
                .setComponents(
                    new ActionRowBuilder().setComponents(
                        new TextInputBuilder()
                            .setLabel("Langage")
                            .setCustomId("language")
                            .setStyle(TextInputStyle.Short)
                    ),
                    
                    new ActionRowBuilder().setComponents(
                        new TextInputBuilder()
                            .setLabel("Code")
                            .setCustomId("code")
                            .setStyle(TextInputStyle.Paragraph)
                    ),
                    
                );
    
                interaction.showModal(modal);
    
        }
} 
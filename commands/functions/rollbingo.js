const { SlashCommandBuilder } = require('discord.js');
const { createBaseEmbed } = require('../utilities/embed');

const rollvalues = [
    "Forfeit tile of choice",
    "Do Nothing",
    "Do Nothing",
    "Do Nothing",
    "Do Nothing",
    "Swap tile with opponent",
    "Steal tile from opponent",
    "No effect",
    "No effect",
    "No effect",
];

function roll() {
    const randomIndex = Math.floor(Math.random() * rollvalues.length);
    return {
        number: randomIndex + 1,
        value: rollvalues[randomIndex],
    };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bingomodifier')
        .setDescription('Spin for a bingo modifier'),
    async execute(interaction) {
        const result = roll();
        const embed = createBaseEmbed()
            .setTitle('Bingo Modifier Roll')
            .addFields(
                { name: 'Roll', value: `${result.number}`, inline: true },
                { name: 'Effect', value: result.value, inline: true },
            );

        await interaction.reply({ embeds: [embed] });
    },
};
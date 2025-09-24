const { EmbedBuilder } = require('discord.js');

function createBaseEmbed() {
  return new EmbedBuilder()
    .setColor(0x0099ff)
    .setFooter({ text: 'Llama Papa', iconURL: 'https://example.com/icon.png' })
    .setTimestamp();
}

module.exports = { createBaseEmbed };
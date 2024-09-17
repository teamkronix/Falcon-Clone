const { EmbedBuilder } = require('discord.js');

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "ping",
  description: "shows the current ping from the bot to the discord servers",
  category: "UTILITY",
  command: {
    enabled: true,
  },
  slashCommand: {
    enabled: true,
    ephemeral: false,
    options: [],
  },

  async messageRun(message, args) {
    const pingembed = new EmbedBuilder()
      .setColor("#ffd700")
      .setDescription(`<:ping:1282268617395933206> **Ping** [\`${Math.floor(message.client.ws.ping)}ms\`](https://discord.gg/luciddream).`);
    
    await message.channel.send({ embeds: [pingembed] });
  },

  async interactionRun(interaction) {
    const pingembed = new EmbedBuilder()
      .setColor("#ffd700")
      .setDescription(`<:ping:1282268617395933206> **Ping** [\`${Math.floor(interaction.client.ws.ping)}ms\`](https://discord.gg/luciddream).`);
    
    await interaction.followUp({ embeds: [pingembed] });
  },
};
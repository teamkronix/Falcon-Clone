const { timeformat } = require("@helpers/Utils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "uptime",
  description: "gives you bot uptime",
  category: "UTILITY",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
  },

  async messageRun(message, args) {
    const embed = new EmbedBuilder()
      .setColor("#ffd700")
      .setDescription(`<:ping:1282268617395933206> **Uptime :** [\`${timeformat(process.uptime())}\`](https://discord.gg/luciddream).`);
    
    await message.channel.send({ embeds: [embed] });
  },

};

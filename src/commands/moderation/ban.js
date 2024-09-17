const { banTarget } = require("@helpers/ModUtils");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "ban",
  description: "bans the specified member",
  category: "MODERATION",
  botPermissions: ["BanMembers"],
  userPermissions: ["BanMembers"],
  command: {
    enabled: true,
    usage: "<ID|@member> [reason]",
    minArgsCount: 1,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "user",
        description: "the target member",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "reason",
        description: "reason for ban",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  async messageRun(message, args) {
    const match = await message.client.resolveUsers(args[0], true);
    const target = match[0];
    if (!target) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription(`> <a:Cross:1267939449820549130> **No user found matching** \`${args[0]}\``);
      return message.safeReply({ embeds: [embed] });
    }
    const reason = message.content.split(args[0])[1].trim();
    const response = await ban(message.member, target, reason);
    await message.safeReply({ embeds: [response] });
  },

  async interactionRun(interaction) {
    const target = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    const response = await ban(interaction.member, target, reason);
    await interaction.followUp({ embeds: [response] });
  },
};

/**
 * @param {import('discord.js').GuildMember} issuer
 * @param {import('discord.js').User} target
 * @param {string} reason
 */
async function ban(issuer, target, reason) {
  const response = await banTarget(issuer, target, reason);
  let embed = new EmbedBuilder().setColor("#ff0000");

  if (typeof response === "boolean") {
    embed
      .setColor("#ff0000")
      .setDescription(`> <a:Check:1267939435790598267> **Successfully __Banned__** ${target.username}`);
  } else if (response === "BOT_PERM") {
    embed.setDescription(
      `> <a:Cross:1267939449820549130> **Unable to __Ban__ ${target.username} (I'm missing permission)**`
    );
  } else if (response === "MEMBER_PERM") {
    embed.setDescription(
      `> <a:Cross:1267939449820549130> **You __Cannot__ Ban** ${target.username}`
    );
  } else {
    embed.setDescription(
      `> <a:Cross:1267939449820549130> **Failed to **__Ban__** ${target.username}`
    );
  }

  return embed;
}

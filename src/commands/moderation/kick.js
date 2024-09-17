const { kickTarget } = require("@helpers/ModUtils");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "kick",
  description: "kicks the specified member",
  category: "MODERATION",
  botPermissions: ["KickMembers"],
  userPermissions: ["KickMembers"],
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
        description: "reason for kick",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  async messageRun(message, args) {
    const target = await message.guild.resolveMember(args[0], true);
    if (!target) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription(`> <a:Cross:1267939449820549130> **No user found matching** \`${args[0]}\``);
      return message.safeReply({ embeds: [embed] });
    }
    const reason = message.content.split(args[0])[1].trim();
    const response = await kick(message.member, target, reason);
    await message.safeReply({ embeds: [response] });
  },

  async interactionRun(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const target = await interaction.guild.members.fetch(user.id);

    const response = await kick(interaction.member, target, reason);
    await interaction.followUp({ embeds: [response] });
  },
};

async function kick(issuer, target, reason) {
  const response = await kickTarget(issuer, target, reason);
  let embed = new EmbedBuilder().setColor("#ff0000");

  if (typeof response === "boolean") {
    embed
      .setColor("#ff0000")
      .setDescription(`> <a:Check:1267939435790598267> **Successfully __Kicked__** ${target.user.username}`);
  } else if (response === "BOT_PERM") {
    embed.setDescription(
      `> <a:Cross:1267939449820549130> **Unable to __Kick__ ${target.user.username} (I'm missing permission)**`
    );
  } else if (response === "MEMBER_PERM") {
    embed.setDescription(
      `> <a:Cross:1267939449820549130> **You __Cannot__ Kick** ${target.user.username}`
    );
  } else {
    embed.setDescription(
      `> <a:Cross:1267939449820549130> **Failed to **__Kick__** ${target.user.username}`
    );
  }

  return embed;
}

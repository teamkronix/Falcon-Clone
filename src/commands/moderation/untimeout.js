const { unTimeoutTarget } = require("@helpers/ModUtils");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "untimeout",
  description: "remove timeout from a member",
  category: "MODERATION",
  botPermissions: ["ModerateMembers"],
  userPermissions: ["ModerateMembers"],
  command: {
    enabled: true,
    aliases: ["unmute"],
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
        description: "reason for timeout removal",
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
        .setDescription(`> <a:Cross:1267939449820549130> No user found matching \`${args[0]}\``);
      return message.safeReply({ embeds: [embed] });
    }
    const reason = args.slice(1).join(" ").trim();
    const response = await untimeout(message.member, target, reason);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const target = await interaction.guild.members.fetch(user.id);

    const response = await untimeout(interaction.member, target, reason);
    await interaction.followUp(response);
  },
};

async function untimeout(issuer, target, reason) {
  const response = await unTimeoutTarget(issuer, target, reason);
  const embed = new EmbedBuilder().setColor("BLURPLE");

  if (typeof response === "boolean") {
    embed.setDescription(
      `> <a:Check:1267939435790598267> **Timeout of** \`${target.user.username}\` **is removed!**`
    );
  } else if (response === "BOT_PERM") {
    embed.setColor("#ff0000").setDescription(
      `> <a:Cross:1267939449820549130> **I do not have permission to remove timeout of** \`${target.user.username}\``
    );
  } else if (response === "MEMBER_PERM") {
    embed.setColor("#ff0000").setDescription(
      `> <a:Cross:1267939449820549130> **You do not have permission to remove timeout of** \`${target.user.username}\``
    );
  } else if (response === "NO_TIMEOUT") {
    embed.setColor("#ffd700").setDescription(
      `> <a:Warning:1267939441523241020> \`${target.user.username}\` **is not timed out!**`
    );
  } else {
    embed.setColor("#ff0000").setDescription(
      `> <a:Cross:1267939449820549130> **Failed to remove timeout of** \`${target.user.username}\``
    );
  }

  return { embeds: [embed] };
}

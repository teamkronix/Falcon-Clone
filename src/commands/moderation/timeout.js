const { timeoutTarget } = require("@helpers/ModUtils");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const ems = require("enhanced-ms");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "timeout",
  description: "timeouts the specified member",
  category: "MODERATION",
  botPermissions: ["ModerateMembers"],
  userPermissions: ["ModerateMembers"],
  command: {
    enabled: true,
    aliases: ["mute"],
    usage: "<ID|@member> <duration> [reason]",
    minArgsCount: 2,
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
        name: "duration",
        description: "the time to timeout the member for",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "reason",
        description: "reason for timeout",
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

    // parse time
    const ms = ems(args[1]);
    if (!ms) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("> <a:Cross:1267939449820549130> **Please provide a __valid__ duration.** *Example:* `1d/1h/1m/1s`");
      return message.safeReply({ embeds: [embed] });
    }

    const reason = args.slice(2).join(" ").trim();
    const response = await timeout(message.member, target, ms, reason);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const user = interaction.options.getUser("user");

    // parse time
    const duration = interaction.options.getString("duration");
    const ms = ems(duration);
    if (!ms) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("> <a:Cross:1267939449820549130> **Please provide a __valid__ duration.** *Example:* `1d/1h/1m/1s`");
      return interaction.followUp({ embeds: [embed] });
    }

    const reason = interaction.options.getString("reason");
    const target = await interaction.guild.members.fetch(user.id);

    const response = await timeout(interaction.member, target, ms, reason);
    await interaction.followUp(response);
  },
};

async function timeout(issuer, target, ms, reason) {
  const response = await timeoutTarget(issuer, target, ms, reason);
  const embed = new EmbedBuilder().setColor("BLURPLE");

  if (typeof response === "boolean") {
    embed.setDescription(
      `> <a:Check:1267939435790598267> **Successfully __Muted__** \`${target.user.username}\` for \`${ems(ms, { long: true })}\``
    );
  } else if (response === "BOT_PERM") {
    embed.setColor("#ff0000").setDescription(
      `> <a:Cross:1267939449820549130> **Unable to __Mute__** \`${target.user.username}\` **(I am missing permission)**`
    );
  } else if (response === "MEMBER_PERM") {
    embed.setColor("#ff0000").setDescription(
      `> <a:Cross:1267939449820549130> **You __Cannot__ Mute** \`${target.user.username}\``
    );
  } else {
    embed.setColor("#ff0000").setDescription(
      `> <a:Cross:1267939449820549130> **Failed to __Mute__** \`${target.user.username}\``
    );
  }

  return { embeds: [embed] };
}

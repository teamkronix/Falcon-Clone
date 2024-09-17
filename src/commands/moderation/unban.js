const { unBanTarget } = require("@helpers/ModUtils");
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ApplicationCommandOptionType,
  ComponentType,
  EmbedBuilder,
} = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "unban",
  description: "unbans the specified member",
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
    ephemeral: true,
    options: [
      {
        name: "name",
        description: "match the name of the member",
        type: ApplicationCommandOptionType.String,
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
    const match = args[0];
    const reason = message.content.split(args[0])[1].trim();

    const response = await getMatchingBans(message.guild, match);
    const sent = await message.safeReply(response);
    if (typeof response !== "string") await waitForBan(message.member, reason, sent);
  },

  async interactionRun(interaction) {
    const match = interaction.options.getString("name");
    const reason = interaction.options.getString("reason");

    const response = await getMatchingBans(interaction.guild, match);
    const sent = await interaction.followUp(response);
    if (typeof response !== "string") await waitForBan(interaction.member, reason, sent);
  },
};

/**
 * @param {import('discord.js').Guild} guild
 * @param {string} match
 */
async function getMatchingBans(guild, match) {
  const bans = await guild.bans.fetch({ cache: false });

  const matched = [];
  for (const [, ban] of bans) {
    if (ban.user.partial) await ban.user.fetch();

    // exact match
    if (ban.user.id === match || ban.user.tag === match) {
      matched.push(ban.user);
      break;
    }

    // partial match
    if (ban.user.username.toLowerCase().includes(match.toLowerCase())) {
      matched.push(ban.user);
    }
  }

  if (matched.length === 0) {
    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setDescription(`> <a:Cross:1267939449820549130> **No user found matching** \`${match}\``);
    return { embeds: [embed] };
  }

  const options = matched.map((user) => ({ label: user.tag, value: user.id }));

  const menuRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder().setCustomId("unban-menu").setPlaceholder("Choose a user to unban").addOptions(options)
  );

  const embed = new EmbedBuilder()
    .setColor("#ffd700")
    .setDescription(">   **Please select a user you wish to unban.**");

  return { embeds: [embed], components: [menuRow] };
}

/**
 * @param {import('discord.js').GuildMember} issuer
 * @param {string} reason
 * @param {import('discord.js').Message} sent
 */
async function waitForBan(issuer, reason, sent) {
  const collector = sent.channel.createMessageComponentCollector({
    filter: (m) => m.member.id === issuer.id && m.customId === "unban-menu" && sent.id === m.message.id,
    time: 20000,
    max: 1,
    componentType: ComponentType.StringSelect,
  });

  collector.on("collect", async (response) => {
    const userId = response.values[0];
    const user = await issuer.client.users.fetch(userId, { cache: true });

    const status = await unBanTarget(issuer, user, reason);
    let embed = new EmbedBuilder();

    if (typeof status === "boolean") {
      embed
        .setColor("#ff0000")
        .setDescription(`> <a:Check:1267939435790598267> **Successfully __Unbanned__** ${user.username}`);
    } else {
      embed
        .setColor("#ff0000")
        .setDescription(`> <a:Cross:1267939449820549130> **Failed to __Unban__** ${user.username}`);
    }

    return sent.edit({ embeds: [embed], components: [] });
  });

  collector.on("end", async (collected) => {
    if (collected.size === 0) {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("> <a:Cross:1267939449820549130> **Oops! Timed out. Try again later.**");
      return sent.edit({ embeds: [embed], components: [] });
    }
  });
}

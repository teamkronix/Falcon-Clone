const { EmbedBuilder, ChannelType, GuildVerificationLevel } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");
const moment = require("moment");

/**
 * @param {import('discord.js').Guild} guild
 */
module.exports = async (guild) => {
  const { name, id, preferredLocale, channels, roles, ownerId } = guild;

  const owner = await guild.members.fetch(ownerId);
  const createdAt = moment(guild.createdAt);

  const totalChannels = channels.cache.size;
  const categories = channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size;
  const textChannels = channels.cache.filter((c) => c.type === ChannelType.GuildText).size;
  const voiceChannels = channels.cache.filter(
    (c) => c.type === ChannelType.GuildVoice || c.type === ChannelType.GuildStageVoice
  ).size;
  const threadChannels = channels.cache.filter(
    (c) => c.type === ChannelType.PrivateThread || c.type === ChannelType.PublicThread
  ).size;

  const memberCache = guild.members.cache;
  const all = memberCache.size;
  const bots = memberCache.filter((m) => m.user.bot).size;
  const users = all - bots;
  const onlineUsers = memberCache.filter((m) => !m.user.bot && m.presence?.status === "online").size;
  const onlineBots = memberCache.filter((m) => m.user.bot && m.presence?.status === "online").size;
  const onlineAll = onlineUsers + onlineBots;
  const rolesCount = roles.cache.size;

  const getMembersInRole = (members, role) => {
    return members.filter((m) => m.roles.cache.has(role.id)).size;
  };

  let rolesString = roles.cache
    .filter((r) => !r.name.includes("everyone"))
    .map((r) => `${r.name}[${getMembersInRole(memberCache, r)}]`)
    .join(", ");

  if (rolesString.length > 1024) rolesString = rolesString.substring(0, 1020) + "...";

  let { verificationLevel } = guild;
  switch (guild.verificationLevel) {
    case GuildVerificationLevel.VeryHigh:
      verificationLevel = "┻�?┻ミヽ(ಠ益ಠ)ノ彡┻�?┻";
      break;

    case GuildVerificationLevel.High:
      verificationLevel = "(╯°□°）╯︵ ┻�?┻";
      break;

    default:
      break;
  }

  let desc = "";
  desc = `${desc + "> "} **Id:** ${id}\n`;
  desc = `${desc + "> "} **Name:** ${name}\n`;
  desc = `${desc + "> "} **Owner:** ${owner.user.username}\n`;
  desc = `${desc + "> "} **Region:** ${preferredLocale}\n`;
  desc += "\n";

  const embed = new EmbedBuilder()
    //.setTitle("GUILD UTILITY")
    .setThumbnail(guild.iconURL())
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setDescription(
      `> ## <a:stolen_emoji:1271191955862458411> [${name}'s info](https://discord.gg/luciddream)\n\n` +
      `<:tutuutility:1282268623624212562> **General Info**\n` +
      `> **Name :** ${name}\n` +
      `> **ID :** ${id}\n` +
      `> **<:MekoOwner:1270054941242691660> Onwer :** ${owner.user.username}\n` +
      `> **<:MekoOwner:1270054941242691660> Mention :** <@!${owner.user.id}>\n` +
      `> **Region :** ${preferredLocale}\n\n` +
      `<:MekoUser:1270056834690187422> **Members**\n` +
      `> **Total :** ${all}\n` +
      `> **Members :** ${users}\n` +
      `> **Bots :** ${bots}\n\n` +
      `<:tutuinchannel:1255239756447744132> **Channels**\n` +
      `> **Categories :** ${categories}\n` +
      `> **Text :** ${textChannels}\n` +
      `> **Voice :** ${voiceChannels}\n` +
      `> **Thread :** ${threadChannels}\n\n` +
      `<:stolen_emoji:1274729909444677743> **Extra**\n` +
      `> **Verfication :** Level ${verificationLevel}\n` +
      `> **Boost Count :** ${guild.premiumSubscriptionCount}\n` +
      `> **Created :** ${createdAt.fromNow()}\n` +
      `> **Exact Date :** ${createdAt.format("dddd, Do MMMM YYYY")}`)
      .setImage("https://github.com/snowded/tutu.DiscordBot/blob/main/TuTu.png?raw=true")

  if (guild.splashURL()) embed.setImage(guild.splashURL({ extension: "png", size: 256 }));

  return { embeds: [embed] };
};

const { EmbedBuilder } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");

/**
 * @param {import('discord.js').GuildMember} member
 */
module.exports = (member) => {
  let color = member.displayHexColor;
  if (color === "#000000") color = EMBED_COLORS.BOT_EMBED;

  let rolesString = member.roles.cache.map((r) => r.name).join(", ");
  if (rolesString.length > 1024) rolesString = rolesString.substring(0, 1020) + "...";

  const embed = new EmbedBuilder()
    .setAuthor({
      name: `User information for ${member.displayName}`,
      iconURL: member.user.displayAvatarURL(),
    })
    .setThumbnail(member.user.displayAvatarURL())
    .setColor(color)
    .setDescription(
      `<:stolen_emoji:1274729909444677743> **General**\n` +
      `>   **Username :** ${member.user.username}\n` +
      `>   **ID :** ${member.id}\n` +
      `>   **Mention :** <@!${member.id}>\n` +
      `>   **Guild Joined :** ${member.joinedAt.toUTCString()}\n` +
      `>   **Discord Joined :** ${member.user.createdAt.toUTCString()}\n` +
      `>   **URLs :** [AvatarUrl](${member.user.displayAvatarURL({ extension: "png" })})`
    )
    .setImage("https://github.com/snowded/tutu.DiscordBot/blob/main/TuTu.png?raw=true")
    .setFooter({ text: `Requested by ${member.user.tag}` })
    .setTimestamp(Date.now());

  return { embeds: [embed] };
};

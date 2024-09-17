const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");

/**
 * @type {import('@structures/BaseContext')}
 */
module.exports = {
  name: "avatar",
  description: "displays avatar information about the user",
  type: ApplicationCommandType.User,
  enabled: true,
  ephemeral: false,

  async run(interaction) {
    const user = await interaction.client.users.fetch(interaction.targetId);
    const response = getAvatar(user);
    await interaction.followUp(response);
  },
};

// In the first file (let's call it avatar.js)

function avatarInfo(user) {
  const x512 = user.displayAvatarURL({ extension: "png", size: 512 });


  const embed = new EmbedBuilder()
    .setTitle(`Avatar of ${user.username}`)
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setImage(x512)
    .setDescription(
      `  **[\`Download\`](${x512})**`
    );

  return {
    embeds: [embed],
  };
}

module.exports = { avatarInfo };
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { EMBED_COLORS, SUPPORT_SERVER, DASHBOARD } = require("@root/config");

module.exports = (client) => {
  const embed = new EmbedBuilder()
    .setAuthor({ name: "Invite" })
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription("  **Hey there! invite me Using the button below to inavigate where you want**");

  // Buttons
  let components = [];
  components.push(new ButtonBuilder().setLabel("Invite Link").setEmoji("<:TutuInvite:1267939527901712567> ").setURL(client.getInvite()).setStyle(ButtonStyle.Link));

  if (SUPPORT_SERVER) {
    components.push(new ButtonBuilder().setLabel("Support Server").setEmoji("<:tutusupportsv:1250748358255968287>").setURL(SUPPORT_SERVER).setStyle(ButtonStyle.Link));
  }

  if (DASHBOARD.enabled) {
    components.push(
      new ButtonBuilder().setLabel("Dashboard Link").setURL(DASHBOARD.baseURL).setStyle(ButtonStyle.Link)
    );
  }

  let buttonsRow = new ActionRowBuilder().addComponents(components);
  return { embeds: [embed], components: [buttonsRow] };
};

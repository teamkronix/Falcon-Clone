const { avatarInfo } = require("../shared/avatar");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "av",
  description: "shows a users avatar information",
  category: "UTILITY",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "( mention / id )",
  },
  async messageRun(message, args) {
    const target = (await message.guild.resolveMember(args[0])) || message.member;
    const response = avatarInfo(target.user);
    await message.safeReply(response);
  },
};
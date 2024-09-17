const config = require("@root/config");
const { enabled } = require("./BaseContext");

module.exports = {
  INVITE: {
    name: "invite",
    enabled: config.INVITE.ENABLED,
  },
  STATS: {
    name: "Messages",
    enabled: config.STATS.ENABLED,
  },
  GIVEAWAY: {
    name: "Giveaway",
  },
  GREETING: {
    name: "Greeting",
  },
  TIMER: {
    name: "Timer",
  },
  MODERATION: {
    name: "Moderation",
    enabled: config.MODERATION.ENABLED,
  },
 UTILITY: {
    name: "Utility",
},
OWNER: {
  name: "owner commands",
},
};

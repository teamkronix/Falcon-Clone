const { ApplicationCommandOptionType } = require("discord.js");
const { activeTimers } = require("@src/commands/timer/timerStore");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "tend",
  description: "stops a running timer by its message ID",
  category: "TIMER",
  userPermissions: [],
  command: {
    enabled: true,
    usage: "<message-id>",
    minArgsCount: 1,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "messageid",
        description: "the message ID of the timer to end",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  async messageRun(message, args) {
    const messageId = args[0];
    const response = await stopTimer(message.channel, messageId);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const messageId = interaction.options.getString("messageid");
    const response = await stopTimer(interaction.channel, messageId);
    await interaction.followUp(response);
  },
};

// Helper function to stop a timer
async function stopTimer(channel, messageId) {
  // Check if the message ID corresponds to a running timer
  if (!activeTimers.has(messageId)) {
    return;
  }

  try {

    const message = await channel.messages.fetch(messageId);

    if (message.author.bot && message.embeds.length > 0) {
      clearTimeout(activeTimers.get(messageId).timeout);
      activeTimers.delete(messageId);

      
      await message.delete();

      return;
    } else {
      return;
    }
  } catch (error) {
    return;
  }
}

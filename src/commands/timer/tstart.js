const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { activeTimers } = require("@src/commands/timer/timerStore");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "tstart",
  description: "sets a countdown timer with a custom message",
  category: "TIMER",
  userPermissions: [],
  command: {
    enabled: true,
    usage: "<duration> <message>",
    minArgsCount: 2,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "duration",
        description: "duration of the timer (e.g., 1h, 30m, 2d, 3mo)",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "message",
        description: "the message for the timer embed title",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  async messageRun(message, args) {
    const duration = args[0];
    const customMessage = args.slice(1).join(" ");
    const response = await startTimer(message, duration, customMessage);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const duration = interaction.options.getString("duration");
    const customMessage = interaction.options.getString("message");
    const response = await startTimer(interaction, duration, customMessage);
    await interaction.followUp(response);
  },
};

async function startTimer(context, duration, customMessage) {
  const seconds = parseDurationToSeconds(duration);
  if (!seconds || seconds <= 0) {
    return "Please provide a valid duration (e.g., `1h`, `30m`, `2d`, `3mo`).";
  }

  const endTime = Math.floor(Date.now() / 1000) + seconds;

  const embed = new EmbedBuilder()
    .setTitle(customMessage)
    .setDescription(`> <:falcon_timer:1285201391761231925> **Timer ends : <t:${endTime}:R> <:falcon_timer:1285201391761231925>**`)
    .setColor(0x00FF00) // Green color
    .setTimestamp();

  // Send the embed and get the message ID
  const timerMessage = await context.channel.send({ embeds: [embed] });

  // Store the timeout using the message ID as the key
  const timeout = setTimeout(async () => {
    // Timer ends; can notify the user if needed
    activeTimers.delete(timerMessage.id); // Remove timer after completion
  }, seconds * 1000);

  activeTimers.set(timerMessage.id, { timeout });

  return;
}

// Helper function to convert duration to seconds
function parseDurationToSeconds(duration) {
  const timeRegex = /^(\d+)([smhdwmo])$/i;
  const match = duration.match(timeRegex);

  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 60 * 60 * 24;
    case 'w': return value * 60 * 60 * 24 * 7;
    case 'mo': return value * 60 * 60 * 24 * 30;
    default: return null;
  }
}

  const { CommandCategory, BotClient } = require("@src/structures");
  const { EMBED_COLORS, SUPPORT_SERVER } = require("@root/config.js");
  const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    Message,
    CommandInteraction,
    ApplicationCommandOptionType,
  } = require("discord.js");
  const { getCommandUsage, getSlashUsage } = require("@handlers/command");
  const { getSettings } = require("@schemas/Guild");

  const CMDS_PER_PAGE = 500;
  const IDLE_TIMEOUT = 30;

  /**
   * @type {import("@structures/Command")}
   */
  module.exports = {
    name: "help",
    description: "command help menu",
    category: "UTILITY",
    botPermissions: ["EmbedLinks"],
    command: {
      enabled: true,
      usage: "[command]",
    },
    slashCommand: {
      enabled: true,
      options: [
        {
          name: "command",
          description: "name of the command",
          required: false,
          type: ApplicationCommandOptionType.String,
        },
      ],
    },

    async messageRun(message, args, data) {
      let trigger = args[0];

      // !help
      if (!trigger) {
        const response = await getHelpMenu(message);
        const sentMsg = await message.safeReply(response);
        return waiter(sentMsg, message.author.id, data.prefix);
      }

      // check if command help (!help cat)
      const cmd = message.client.getCommand(trigger);
      if (cmd) {
        const embed = getCommandUsage(cmd, data.prefix, trigger);
        return message.safeReply({ embeds: [embed] });
      }

      // No matching command/category found
      await message.safeReply("No matching command found");
    },

    async interactionRun(interaction) {
      let cmdName = interaction.options.getString("command");

      // !help
      if (!cmdName) {
        const response = await getHelpMenu(interaction);
        const sentMsg = await interaction.followUp(response);
        return waiter(sentMsg, interaction.user.id);
      }

      // check if command help (!help cat)
      const cmd = interaction.client.slashCommands.get(cmdName);
      if (cmd) {
        const embed = getSlashUsage(cmd);
        return interaction.followUp({ embeds: [embed] });
      }

      // No matching command/category found
      await interaction.followUp("No matching command found");
    },
  };

  /**
   * @param {Message | CommandInteraction} ctx
   */
  async function getHelpMenu(message, ctx) {
    // Menu Row
    const options = [];
    for (const [k, v] of Object.entries(CommandCategory)) {
      if (v.enabled === false) continue;
      options.push({
        label: v.name,
        value: k,
        description: `View commands in ${v.name} category`,
        emoji: v.emoji,
      });
    }


    const linkButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
          .setLabel("Get Premium")
          .setURL("https://discord.gg/teamkronix")
          .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
          .setLabel("Dashboard")
          .setURL("https://discord.gg/teamkronix")
          .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
          .setLabel("Invite Me")
          .setURL("https://discord.gg/teamkronix")
          .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
          .setLabel("Support Server")
          .setURL("https://discord.gg/teamkronix")
          .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
          .setLabel("Vote Me")
          .setURL("https://discord.gg/teamkronix")
          .setStyle(ButtonStyle.Link),
    );

    const menuRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("help-menu")
        .setPlaceholder("Choose the command category")
        .addOptions(options)
    );
    const settings = await getSettings(message.guild);
    const embed = new EmbedBuilder()
      .setAuthor({ name: "Falcon Bot Help Panel" })
            .setColor("#5865F2")
      .setDescription(`
        Hey there, my prefix in this guild is \`${settings.prefix}\`

        <:emote:1285217112180396164> Dashboard Beta Access Applications Open at [Support server!](https://discord.gg/teamkronix)
        <:emote:1285217112180396164> Upgrade your Discord server with [Falcon Premium](https://discord.gg/teamkronix)

        I can do invite tracking, manage your server events with a greet system, timer, polls, and much more! You can check out my other commands in the context menu!
                            
        <:falcon_invite:1285200852298240077> Invite tracking
        <:falcon_msg:1285217112180396164> Messages
        <:falcon_giveaway:1285201012176457771> Giveaways
        <:falcon_greet:1285201297561227327> Greet
        <:falcon_timer:1285201391761231925> Timer
        <:falcon_moderation:1285201473810202645> Moderation
        <:falcon_poll:1285201669822349424> Poll
        <:falcon_utility:1285201655125512236> Utility
        <:falcon_contact:1285201138240589831> Contact
                            `);

    return {
      embeds: [embed],
      components: [menuRow, linkButtons],
    };
  }

  /**
   * @param {Message} msg
   * @param {string} userId
   * @param {string} prefix
   */
  const waiter = (msg, userId, prefix) => {
    const collector = msg.channel.createMessageComponentCollector({
      filter: (reactor) => reactor.user.id === userId && msg.id === reactor.message.id,
      idle: IDLE_TIMEOUT * 60000,
      dispose: true,
      time: 5 * 60 * 60000,
    });

    let arrEmbeds = [];

    collector.on("collect", async (response) => {
      await response.deferUpdate();

      if (response.isStringSelectMenu()) {
        if (response.customId === "help-menu") {
          const cat = response.values[0].toUpperCase();
          arrEmbeds = prefix ? getMsgCategoryEmbeds(msg.client, cat, prefix) : getSlashCategoryEmbeds(msg.client, cat);
          
          const linkButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Get Premium")
                .setURL("https://discord.gg/teamkronix")
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel("Dashboard")
                .setURL("https://discord.gg/teamkronix")
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel("Invite Me")
                .setURL("https://discord.gg/teamkronix")
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel("Support Server")
                .setURL("https://discord.gg/teamkronix")
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel("Vote Me")
                .setURL("https://discord.gg/teamkronix")
                .setStyle(ButtonStyle.Link),
          );

          const options = [];
    for (const [k, v] of Object.entries(CommandCategory)) {
      if (v.enabled === false) continue;
      options.push({
        label: v.name,
        value: k,
        description: `View commands in ${v.name} category`,
        emoji: v.emoji,
      });
    }
      
          const menuRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId("help-menu")
              .setPlaceholder("Choose the command category")
              .addOptions(options)
          );


          msg.editable && (await msg.edit({ embeds: [arrEmbeds[0]], components: [menuRow, linkButtons] }));
        }
      } else if (response.isButton()) {
        if (response.customId === "back_button") {
          const helpMenu = await getHelpMenu(msg);
          msg.editable && (await msg.edit(helpMenu));
        }
      }
    });

    collector.on("end", () => {
      if (!msg.guild || !msg.channel) return;
      return msg.editable && msg.edit({ components: [] });
    });
  };

  /**
   * Returns an array of message embeds for a particular command category [SLASH COMMANDS]
   * @param {BotClient} client
   * @param {string} category
   */
  function getSlashCategoryEmbeds(client, category) {
    let collector = "";

    // For IMAGE Category
    if (category === "IMAGE") {
      client.slashCommands
        .filter((cmd) => cmd.category === category)
        .forEach((cmd) => (collector += `\`/${cmd.name}\``));

      const availableFilters = client.slashCommands
        .get("filter")
        .slashCommand.options[0].choices.map((ch) => ch.name)
        .join(", ");

      const availableGens = client.slashCommands
        .get("generator")
        .slashCommand.options[0].choices.map((ch) => ch.name)
        .join(", ");

      collector +=
        "**Available Filters:**\n" + `${availableFilters}` + `*\n\n**Available Generators**\n` + `${availableGens}`;

      const embed = new EmbedBuilder()
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setThumbnail(CommandCategory[category]?.image)
        .setAuthor({ name: `${category} Commands` })
        .setDescription(collector);

      return [embed];
    }

    // For REMAINING Categories
    const commands = Array.from(client.slashCommands.filter((cmd) => cmd.category === category).values());

    if (commands.length === 0) {
      const embed = new EmbedBuilder()
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setThumbnail(CommandCategory[category]?.image)
        .setAuthor({ name: `${category} Commands` })
        .setDescription("> <:LovePeekCat:1280530079361011772> **No commands in this category**");

      return [embed];
    }

    const arrSplitted = [];
    const arrEmbeds = [];

    while (commands.length) {
      let toAdd = commands.splice(0, commands.length > CMDS_PER_PAGE ? CMDS_PER_PAGE : commands.length);

      toAdd = toAdd.map((cmd) => {
        const subCmds = cmd.slashCommand.options?.filter((opt) => opt.type === ApplicationCommandOptionType.Subcommand);
        const subCmdsString = subCmds?.map((s) => s.name).join(", ");

        return `\`/${cmd.name}\``;
      });

      arrSplitted.push(toAdd);
    }

    arrSplitted.forEach((item, index) => {
      const embed = new EmbedBuilder()
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setThumbnail(CommandCategory[category]?.image)
        .setAuthor({ name: `${category} Commands` })
        .setDescription(item.join(", "))
        .setFooter({ text: `page ${index + 1} of ${arrSplitted.length}` });
      arrEmbeds.push(embed);
    });

    return arrEmbeds;
  }

  /**
   * Returns an array of message embeds for a particular command category [MESSAGE COMMANDS]
   * @param {BotClient} client
   * @param {string} category
   * @param {string} prefix
   */
  function getMsgCategoryEmbeds(client, category, prefix) {
    let collector = "";

    // For IMAGE Category
    if (category === "IMAGE") {
      client.commands
        .filter((cmd) => cmd.category === category)
        .forEach((cmd) =>
          cmd.command.aliases.forEach((alias) => {
            collector += `\`${alias}\`, `;
          })
        );

      collector +=
        "\n\n```yaml\nYou can use these image commands in following formats\n```" +
        `**[${prefix}cmd :](https://discord.gg/luciddream)** Picks message authors avatar as image\n` +
        `**[${prefix}cmd \`<@member>\` :](https://discord.gg/luciddream)** Picks mentioned members avatar as image\n` +
        `**[${prefix}cmd \`<url>\` :](https://discord.gg/luciddream)** Picks image from provided URL\n` +
        `**[${prefix}cmd \`<attachment>\` :](https://discord.gg/luciddream)** Picks attachment image`;

      const embed = new EmbedBuilder()
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setThumbnail(CommandCategory[category]?.image)
        .setAuthor({ name: `${category} Commands` })
        .setDescription(collector);

      return [embed];
    }

    // For REMAINING Categories
    const commands = client.commands.filter((cmd) => cmd.category === category);

    if (commands.length === 0) {
      const embed = new EmbedBuilder()
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setThumbnail(CommandCategory[category]?.image)
        .setAuthor({ name: `${category} Commands` })
        .setDescription("> <:LovePeekCat:1280530079361011772> **The commands of the following category will be available soon**");

      return [embed];
    }

    const arrSplitted = [];
    const arrEmbeds = [];

    while (commands.length) {
      let toAdd = commands.splice(0, commands.length > CMDS_PER_PAGE ? CMDS_PER_PAGE : commands.length);
      toAdd = toAdd.map((cmd) => `<:emote:1285217112180396164> \`${prefix}${cmd.name}\` - ${cmd.description}`);
      arrSplitted.push(toAdd);
    }

    arrSplitted.forEach((item, index) => {
      const embed = new EmbedBuilder()
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setThumbnail(CommandCategory[category]?.image)
        .setAuthor({ name: `${category} Commands` })
        .setDescription(item.join("\n"));
      arrEmbeds.push(embed);
    });

    return arrEmbeds;
  }
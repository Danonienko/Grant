import { BaseInteraction, ClientEvents } from "discord.js";
import Grant from "index.js";
import { IEvent } from "Types/Globals.js";
import EmbedTemplates from "Util/EmbedTemplates.js";

export default class InteractionCreateEvent implements IEvent {
	public readonly Name: keyof ClientEvents = "interactionCreate";

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: BaseInteraction<"cached">) {
		if (!interaction.isChatInputCommand()) return;

		try {
			const commandName = interaction.commandName;

			this.Grant.Log.Debug(`Interaction Created: ${commandName}`);

			let command = this.Grant.Bot.Commands.get(commandName);

			if (!command) {
				this.Grant.Log.Warn("Command not found");

				return interaction.reply({
					embeds: [EmbedTemplates.CommandNotFound(commandName)]
				});
			}

			this.Grant.Log.Debug(`Command Found: ${command.Name}`);

			if (command.IsIndexer) {
				this.Grant.Log.Debug(`Detected '${command.Name}' as indexer`);

				const subCommandName = interaction.options.getSubcommand(true);

				this.Grant.Log.Debug(`Found Subcommand: ${subCommandName}`);

				command = command.SubCommands?.find(
					(subCommand) => subCommand.Name == subCommandName
				);

				if (!command) {
					this.Grant.Log.Warn("Subcommand not found");

					return interaction.reply({
						embeds: [
							EmbedTemplates.CommandNotFound(subCommandName, true)
						]
					});
				}
			}

			if (
				command.Developer &&
				!this.Grant.BotDevelopers.includes(interaction.user.id)
			)
				return interaction.reply({
					content: "This is a developer command, shoo!"
				});

			if (
				command.Roles &&
				!this.Grant.Bot.HasRole(interaction.member, command.Roles)
			)
				return interaction.reply({
					embeds: [EmbedTemplates.Denied]
				});

			await command.Execute(interaction);

			return this.Grant.Log.Debug(`Command Executed: ${command.Name}`);
		} catch (error) {
			this.Grant.Log.Error(error);

			if (interaction.replied || interaction.deferred)
				await interaction.followUp({
					embeds: [EmbedTemplates.InternalError(String(error))]
				});
			else
				await interaction.reply({
					embeds: [EmbedTemplates.InternalError(String(error))]
				});
		}

		return;
	}
}

import {
	BaseInteraction,
	Events,
	InteractionReplyOptions,
	MessageFlags
} from "discord.js";
import Grant from "index.js";
import { IEvent } from "Types/Globals.js";

export default class InteractionCreateEvent implements IEvent {
	public readonly Name: Events = Events.InteractionCreate;
	public readonly Grant: Grant;

	public constructor(grant: Grant) {
		this.Grant = grant;
	}

	public async Execute(interaction: BaseInteraction) {
		if (!interaction.isChatInputCommand()) return;

		try {
			this.Grant.Log.Debug(
				`Interaction Caught: ${interaction.commandName}`
			);

			const command = this.Grant.Bot.Commands.find(
				(command) => command.Name == interaction.commandName
			);

			if (!command) {
				this.Grant.Log.Debug("Command not found");

				return interaction.reply({
					content: `No command matching \`${interaction.commandName}\` was found`
				});
			}

			this.Grant.Log.Debug(`Command Found: ${command.Name}`);

			await command.Execute(interaction);

			this.Grant.Log.Debug(`Command Executed: ${command.Name}`);
		} catch (error) {
			this.Grant.Log.Error(error);

			const reply: InteractionReplyOptions = {
				content: "There was an error while executing this command!",
				flags: MessageFlags.Ephemeral
			};

			if (interaction.replied || interaction.deferred)
				await interaction.followUp(reply);
			else await interaction.reply(reply);
		}

		return;
	}
}

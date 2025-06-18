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

		const command = await this.Grant.Bot.GetCommand(
			interaction.commandName
		);

		if (!command)
			return interaction.reply({
				content: `No command matching \`${interaction.commandName}\` was found`
			});

		try {
			await command.Execute(interaction);
		} catch (error) {
			console.error(error);

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

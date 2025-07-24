import { ChatInputCommandInteraction } from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";
import EmbedTemplates from "Util/EmbedTemplates.js";

export default class SettingsCommand implements ICommand {
	public readonly Name: Lowercase<string> = "settings";
	public readonly Description: string = "Open the settings menu";

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		return interaction.reply({
			embeds: [EmbedTemplates.CommandNotImplemented]
		});
	}
}

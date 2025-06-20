import EmbedTemplates from "Bot/Util/EmbedTemplates.js";
import { ChatInputCommandInteraction } from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class RegisterCommand implements ICommand {
	public readonly Name: Lowercase<string> = "register";
	public readonly Description: string = "Register yourself within NFSF";

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		return interaction.reply({
			embeds: [EmbedTemplates.CommandNotImplemented]
		});
	}
}

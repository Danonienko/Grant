import {
	ApplicationCommandOptionBase,
	SlashCommandUserOption,
	ChatInputCommandInteraction
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";
import EmbedTemplates from "Util/EmbedTemplates.js";

export default class OfficerInfoCommand implements ICommand {
	public readonly Name: Lowercase<string> = "info";
	public readonly Description: string = "Retrieve info about an officer";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandUserOption()
			.setName("officer")
			.setDescription("The officer to retrieve an info from")
			.setRequired(true)
	];

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		return interaction.reply({
			embeds: [EmbedTemplates.CommandNotImplemented]
		});
	}
}

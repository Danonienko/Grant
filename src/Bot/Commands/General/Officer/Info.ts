import EmbedTemplates from "Bot/Util/EmbedTemplates.js";
import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	SlashCommandUserOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class OfficerInfoCommand implements ICommand {
	public readonly Name: Lowercase<string> = "info";
	public readonly Description: string = "Get the officer info";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandUserOption()
			.setName("officer")
			.setDescription("The officer to get info from")
			.setRequired(false)
	];

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		return interaction.reply({
			embeds: [EmbedTemplates.CommandNotImplemented]
		});
	}
}

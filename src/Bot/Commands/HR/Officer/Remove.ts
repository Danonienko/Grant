import EmbedTemplates from "Bot/Util/EmbedTemplates.js";
import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	SlashCommandStringOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class OfficerRemoveCommand implements ICommand {
	public readonly Name: Lowercase<string> = "remove";
	public readonly Description: string = "Remove an officer from NFSF";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandStringOption()
			.setName("id")
			.setDescription("The Discord ID of the officer to remove")
			.setRequired(true)
	];

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		return interaction.reply({
			embeds: [EmbedTemplates.CommandNotImplemented]
		});
	}
}

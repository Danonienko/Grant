import EmbedTemplates from "Bot/Util/EmbedTemplates.js";
import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	SlashCommandUserOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class OfficerDemoteCommand implements ICommand {
	public readonly Name: Lowercase<string> = "demote";
	public readonly Description: string = "Demote an officer by one rank";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandUserOption()
			.setName("officer")
			.setDescription("The officer to demote")
			.setRequired(true)
	];

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		return interaction.reply({
			embeds: [EmbedTemplates.CommandNotImplemented]
		});
	}
}

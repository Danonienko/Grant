import EmbedTemplates from "Bot/Util/EmbedTemplates.js";
import { RankStacks } from "Bot/Util/Ranks.js";
import {
	ApplicationCommandOptionBase,
	SlashCommandUserOption,
	ChatInputCommandInteraction,
	SlashCommandNumberOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class MarksSetCommand implements ICommand {
	public readonly Name: Lowercase<string> = "set";
	public readonly Description: string = "Set the marks of the officer";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandUserOption()
			.setName("officer")
			.setDescription("The officer to set marks")
			.setRequired(true),
		new SlashCommandNumberOption()
			.setName("value")
			.setDescription("To what value of marks you want to set")
			.setRequired(true)
	];

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		if (!RankStacks.MRAndHigher.includes(interaction.user.id))
			return interaction.reply({ embeds: [EmbedTemplates.DeniedMaly] });

		return interaction.reply({
			embeds: [EmbedTemplates.CommandNotImplemented]
		});
	}
}

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

export default class MarksSubtractCommand implements ICommand {
	public readonly Name: Lowercase<string> = "subtract";
	public readonly Description: string = "Take marks from the officer";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandUserOption()
			.setName("officer")
			.setDescription("The officer to take marks from")
			.setRequired(true),
		new SlashCommandNumberOption()
			.setName("amount")
			.setDescription("Amount of marks you want to take")
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

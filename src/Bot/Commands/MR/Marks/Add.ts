import EmbedTemplates from "Bot/Util/EmbedTemplates.js";
import { RankStacks } from "Bot/Util/Ranks.js";
import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	SlashCommandNumberOption,
	SlashCommandUserOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class MarksAddCommand implements ICommand {
	public readonly Name: Lowercase<string> = "add";
	public readonly Description: string = "Grant marks to the officer";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandUserOption()
			.setName("officer")
			.setDescription("The officer to grant marks")
			.setRequired(true),
		new SlashCommandNumberOption()
			.setName("amount")
			.setDescription("Amount of marks you want to add")
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

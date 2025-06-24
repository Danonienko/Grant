import {
	ApplicationCommandOptionBase,
	SlashCommandUserOption,
	ChatInputCommandInteraction,
	SlashCommandNumberOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";
import EmbedTemplates from "Util/EmbedTemplates.js";

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
		if (!this.Grant.Bot.GetRole(interaction, "MRAndHigher"))
			return interaction.reply({ embeds: [EmbedTemplates.DeniedMaly] });

		await interaction.deferReply();

		const user = interaction.options.getUser("officer", true);
		const amount = interaction.options.getNumber("amount", true);
		const knex = this.Grant.Bot.Knex;

		const officer = await knex<Officer>("Officers")
			.select()
			.where("Discord_ID", user.id)
			.first();

		if (!officer)
			return interaction.editReply({
				embeds: [EmbedTemplates.OfficerNotFound(user.username)]
			});

		officer.Marks -= amount;

		await knex<Officer>("Officers").update(officer);

		return interaction.editReply(
			`<@${interaction.user.id}> ${officer.Discord_Username} now has **${officer.Marks}** marks`
		);
	}
}

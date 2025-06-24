import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	SlashCommandNumberOption,
	SlashCommandUserOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";
import EmbedTemplates from "Util/EmbedTemplates.js";

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
		if (!this.Grant.Bot.GetRole(interaction, "MRAndHigher"))
			return interaction.reply({ embeds: [EmbedTemplates.DeniedMaly] });

		await interaction.deferReply();

		const knex = this.Grant.Bot.Knex;
		const user = interaction.options.getUser("officer", true);
		const amount = interaction.options.getNumber("amount", true);

		const officer = await knex<Officer>("Officers")
			.select()
			.where("Discord_ID", user.id)
			.first();

		if (!officer)
			return interaction.editReply({
				embeds: [EmbedTemplates.OfficerNotFound(user.username)]
			});

		officer.Marks += amount;
		await knex<Officer>("Officers").update("Marks", officer.Marks);

		return interaction.editReply(
			`<@${interaction.user.id}> ${officer.Discord_Username} now has **${officer.Marks}** marks`
		);
	}
}

import {
	ApplicationCommandOptionBase,
	SlashCommandUserOption,
	ChatInputCommandInteraction,
	SlashCommandNumberOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";
import EmbedTemplates from "Util/EmbedTemplates.js";

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
		if (!this.Grant.Bot.GetRole(interaction, "MRAndHigher"))
			return interaction.reply({ embeds: [EmbedTemplates.DeniedMaly] });

		const user = interaction.options.getUser("officer", true);
		const value = interaction.options.getNumber("value", true);
		const knex = this.Grant.Bot.Knex;

		const officer = await knex<Officer>("Officers")
			.select()
			.where("Discord_ID", user.id)
			.first();

		if (!officer)
			return interaction.reply({
				embeds: [EmbedTemplates.OfficerNotFound(user.username)]
			});

		officer.Marks = value;

		await knex<Officer>("Officers")
			.update("Marks", officer.Marks)
			.where("Discord_ID", officer.Discord_ID);

		return interaction.reply(
			`<@${interaction.user.id}> ${officer.Discord_Username} marks are set to **${officer.Marks}**`
		);
	}
}

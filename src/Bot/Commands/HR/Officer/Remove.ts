import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	SlashCommandStringOption,
	SlashCommandUserOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";
import EmbedTemplates from "Util/EmbedTemplates.js";

export default class OfficerRemoveCommand implements ICommand {
	public readonly Name: Lowercase<string> = "remove";
	public readonly Description: string = "Remove an officer from NFSF";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandUserOption()
			.setName("officer")
			.setDescription("The Officer to remove")
			.setRequired(false),
		new SlashCommandStringOption()
			.setName("id")
			.setDescription("The Discord ID of the officer to remove")
			.setRequired(false)
	];

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		if (!this.Grant.Bot.GetRole(interaction, "HRAndHigher"))
			return interaction.reply({ embeds: [EmbedTemplates.Denied] });

		await interaction.deferReply();

		const user = interaction.options.getUser("officer", false);
		const userId = interaction.options.getString("id", false);
		const id = user?.id ?? userId;

		if (!id) return interaction.editReply("No Officer or User ID provided");

		const knex = this.Grant.Bot.Knex;
		const officer = await knex<Officer>("Officers")
			.select()
			.where("Discord_ID", id)
			.first();

		if (!officer)
			return interaction.editReply("No officer found in database");

		await knex<Officer>("Officers")
			.delete()
			.where("OfficerID", officer.OfficerID);

		if (
			await knex<Officer>("Officers")
				.select()
				.where("Discord_ID", id)
				.first()
		)
			return "Could not remove officer from database";

		return interaction.editReply("Successfully removed Officer");
	}
}

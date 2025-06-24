import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	SlashCommandUserOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";
import EmbedTemplates from "Util/EmbedTemplates.js";
import { RankStacks } from "Util/Ranks.js";

export default class OfficerRegisterCommand implements ICommand {
	public readonly Name: Lowercase<string> = "register";
	public readonly Description: string = "Register yourself within NFSF";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandUserOption()
			.setName("user")
			.setDescription("The user to register into NFSF database")
			.setRequired(true)
	];

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		if (!RankStacks.HRAndHigher.includes(interaction.user.id))
			return interaction.reply({ embeds: [EmbedTemplates.Denied] });

		await interaction.deferReply();

		const knex = this.Grant.Bot.Knex;
		const user = interaction.options.getUser("user", true);

		if (
			await knex<Officer>("Officers")
				.select()
				.where("Discord_ID", user.id)
				.first()
		)
			return interaction.editReply(
				`${user.username} is already registered you fool.`
			);

		await knex<Officer>("Officers").insert({
			Discord_Username: user.username,
			Discord_ID: user.id
		});

		const newOfficer = await knex<Officer>("Officers")
			.select()
			.where("Discord_ID", user.id)
			.first();

		if (!newOfficer) return interaction.editReply("Registration failed");

		return interaction.editReply("Registration successful");
	}
}

import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	SlashCommandUserOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";
import EmbedTemplates from "Util/EmbedTemplates.js";

export default class OfficerRegisterCommand implements ICommand {
	public readonly Name: Lowercase<string> = "register";
	public readonly Description: string = "Register yourself within NFSF";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandUserOption()
			.setName("user")
			.setDescription("The user to register into NFSF database")
			.setRequired(false)
	];

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const knex = this.Grant.Bot.Knex;
		const user = interaction.options.getUser("user", false);

		if (!user) {
			if (!this.Grant.Bot.GetRole(interaction, "LRAndHigher"))
				return interaction.editReply({
					embeds: [EmbedTemplates.Denied]
				});

			if (
				await knex<Officer>("Officers")
					.select()
					.where("Discord_ID", interaction.user.id)
					.first()
			)
				return interaction.editReply(
					"WHAT IS YOUR MAJOR MALFUNCTION, NUMBNUTS? YOU'VE ALREADY REGISTERED. YOU WORTHLESS PIECE OF SHIT."
				);

			await knex<Officer>("Officers").insert({
				Discord_Username: interaction.user.username,
				Discord_ID: interaction.user.id
			});

			return interaction.editReply("Successfully registered");
		}

		if (!this.Grant.Bot.GetRole(interaction, "HRAndHigher"))
			return interaction.editReply({ embeds: [EmbedTemplates.Denied] });

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

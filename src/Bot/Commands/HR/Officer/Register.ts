import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	SlashCommandUserOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";
import EmbedTemplates from "Util/EmbedTemplates.js";
import { Ranks } from "Util/Ranks.js";

export default class OfficerRegisterCommand implements ICommand {
	public readonly Name: Lowercase<string> = "register";
	public readonly Description: string = "Register yourself within NFSF";
	public readonly Roles?: string[] | undefined = Ranks.LRAndHigher;
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandUserOption()
			.setName("user")
			.setDescription("The user to register into NFSF database")
			.setRequired(false)
	];

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction<"cached">) {
		await interaction.deferReply();

		const knex = this.Grant.Bot.Knex;
		const user = interaction.options.getUser("user", false);

		if (!user) {
			if (
				await knex<Officers>("Officers")
					.select()
					.where("Discord_ID", interaction.user.id)
					.first()
			)
				return interaction.editReply(
					"WHAT IS YOUR MAJOR MALFUNCTION, NUMBNUTS? YOU'VE ALREADY REGISTERED. YOU WORTHLESS PIECE OF SHIT."
				);

			await knex<Officers>("Officers").insert({
				Discord_Username: interaction.user.username,
				Discord_ID: interaction.user.id
			});

			return interaction.editReply("Successfully registered");
		}

		if (!this.Grant.Bot.HasRole(interaction.member, Ranks.HRAndHigher))
			return interaction.editReply({ embeds: [EmbedTemplates.Denied] });

		if (
			await knex<Officers>("Officers")
				.select()
				.where("Discord_ID", user.id)
				.first()
		)
			return interaction.editReply(
				`${user.username} is already registered you fool.`
			);

		await knex<Officers>("Officers").insert({
			Discord_Username: user.username,
			Discord_ID: user.id
		});

		const newOfficer = await knex<Officers>("Officers")
			.select()
			.where("Discord_ID", user.id)
			.first();

		if (!newOfficer) return interaction.editReply("Registration failed");

		return interaction.editReply("Registration successful");
	}
}

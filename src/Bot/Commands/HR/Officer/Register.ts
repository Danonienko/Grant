import { ChatInputCommandInteraction } from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class OfficerRegisterCommand implements ICommand {
	public readonly Name: Lowercase<string> = "register";
	public readonly Description: string = "Register yourself within NFSF";

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const knex = this.Grant.Bot.Knex<Officer>("Officers");
		const user = interaction.user;

		if (await knex.select().where("Discord_ID", user.id).first())
			return interaction.editReply(
				"WHAT IS YOUR MAJOR MALFUNCTION, NUMBNUTS? YOU'VE ALREADY REGISTERED. YOU WORTHLESS PIECE OF SHIT."
			);

		await knex.insert({
			Discord_Username: user.username,
			Discord_ID: user.id
		});

		const newOfficer = await knex
			.select()
			.where("Discord_ID", user.id)
			.first();

		if (!newOfficer) return interaction.editReply("Registration failed");

		return interaction.editReply("Registration successful");
	}
}

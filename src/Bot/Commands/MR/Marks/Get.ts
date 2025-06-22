import {
	ApplicationCommandOptionBase,
	SlashCommandUserOption,
	ChatInputCommandInteraction
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class MarksGetCommand implements ICommand {
	public readonly Name: Lowercase<string> = "get";
	public readonly Description: string =
		"See how much marks the officer has. Alternatively you can use officer info command";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandUserOption()
			.setName("officer")
			.setDescription("The officer to get marks from")
			.setRequired(true)
	];

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const knex = this.Grant.Bot.Knex<Officer>("Officers");

		const user = interaction.options.getUser("officer", true);

		const officer = await knex
			.select()
			.where("Discord_ID", user.id)
			.first();

		if (!officer) return interaction.editReply("Officer not found");

		return interaction.editReply(
			`${user.displayName} has **${officer.Marks}** marks`
		);
	}
}

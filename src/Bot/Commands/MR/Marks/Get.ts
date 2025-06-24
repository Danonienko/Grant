import {
	ApplicationCommandOptionBase,
	SlashCommandUserOption,
	ChatInputCommandInteraction
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";
import EmbedTemplates from "Util/EmbedTemplates.js";

export default class MarksGetCommand implements ICommand {
	public readonly Name: Lowercase<string> = "get";
	public readonly Description: string =
		"See how much marks the officer has. Alternatively you can use officer info command";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandUserOption()
			.setName("officer")
			.setDescription("The officer to get marks from")
			.setRequired(false)
	];

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const knex = this.Grant.Bot.Knex;
		const user = interaction.options.getUser("officer", false);

		if (!user) {
			const officer = await knex<Officer>("Officers")
				.select()
				.where("Discord_ID", interaction.user.id)
				.first();

			if (!officer)
				return interaction.editReply(`Your ass is not a registered.`);

			return interaction.editReply(
				`<@${interaction.user.id}> You have **${officer.Marks}** marks`
			);
		}

		const officer = await knex<Officer>("Officers")
			.select()
			.where("Discord_ID", user.id)
			.first();

		if (!officer)
			return interaction.editReply({
				embeds: [EmbedTemplates.OfficerNotFound(user.username)]
			});

		return interaction.editReply(
			`<@${interaction.user.id}> ${officer.Discord_Username} has **${officer.Marks}** marks`
		);
	}
}

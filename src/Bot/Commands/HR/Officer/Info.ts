import {
	ApplicationCommandOptionBase,
	SlashCommandUserOption,
	ChatInputCommandInteraction,
	EmbedBuilder,
	Colors
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";
import EmbedTemplates, { FooterTemplates } from "Util/EmbedTemplates.js";

export default class OfficerInfoCommand implements ICommand {
	public readonly Name: Lowercase<string> = "info";
	public readonly Description: string = "Retrieve info about an officer";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandUserOption()
			.setName("officer")
			.setDescription("The officer to retrieve an info from")
			.setRequired(false)
	];

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const user = interaction.options.getUser("officer", false);
		const knex = this.Grant.Bot.Knex;

		if (!user) {
			const officer = await knex<Officers>("Officers")
				.select()
				.where("Discord_ID", interaction.user.id)
				.first();

			if (!officer)
				return interaction.editReply(`GET OUT!
-# You are not registered`);

			return interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setTitle(`Officer Info: ${interaction.user.username}`)
						.setThumbnail(interaction.user.avatarURL())
						.setDescription(
							"Here is information and statistics of you"
						)
						.setFields([
							{ name: "Marks", value: String(officer.Marks) }
						])
						.setColor(Colors.DarkGreen)
						.setTimestamp()
						.setFooter(FooterTemplates.Version)
				]
			});
		}

		const officer = await knex<Officers>("Officers")
			.select()
			.where("Discord_ID", user.id)
			.first();

		if (!officer)
			return interaction.editReply({
				embeds: [EmbedTemplates.OfficerNotFound(user.username)]
			});

		return interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`Officer Info: ${user.username}`)
					.setThumbnail(user.avatarURL())
					.setDescription(
						"Here is information and statistics of this officer"
					)
					.setFields([
						{ name: "Marks", value: String(officer.Marks) }
					])
					.setColor(Colors.DarkGreen)
					.setTimestamp()
					.setFooter(FooterTemplates.Version)
			]
		});
	}
}

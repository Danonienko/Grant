import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	SlashCommandUserOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";
import EmbedTemplates from "Util/EmbedTemplates.js";

export default class OfficerPromoteCommand implements ICommand {
	public readonly Name: Lowercase<string> = "promote";
	public readonly Description: string = "Promote an officer by one rank";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandUserOption()
			.setName("officer")
			.setDescription("The officer to promote")
			.setRequired(true)
	];

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		if (!this.Grant.Bot.GetRole(interaction, "HRAndHigher"))
			return interaction.reply({ embeds: [EmbedTemplates.Denied] });

		return interaction.reply({
			embeds: [EmbedTemplates.CommandNotImplemented]
		});
	}
}

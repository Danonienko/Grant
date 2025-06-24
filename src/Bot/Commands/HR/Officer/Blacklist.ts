import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	SlashCommandStringOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";
import EmbedTemplates from "Util/EmbedTemplates.js";

export default class OfficerBlacklistCommand implements ICommand {
	public readonly Name: Lowercase<string> = "blacklist";
	public readonly Description: string = "Blacklist the officer from NFSF";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandStringOption()
			.setName("id")
			.setDescription("The Discord ID of the officer to blacklist")
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

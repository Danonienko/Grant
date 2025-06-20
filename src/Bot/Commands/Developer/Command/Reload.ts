import EmbedTemplates from "Bot/Util/EmbedTemplates.js";
import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	SlashCommandStringOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class ReloadCommand implements ICommand {
	public readonly Name: Lowercase<string> = "reload";
	public readonly Description: string = "[DEV] Reloads a command";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandStringOption()
			.setName("name")
			.setDescription("The name of the command to reload ")
			.setRequired(true)
	];
	public readonly Developer?: boolean | undefined = true;

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const commandName = interaction.options.getString("name", true);

		const [success, message] = await this.Grant.Bot.ReloadCommand(
			commandName
		);

		if (success)
			return interaction.editReply({
				embeds: [
					EmbedTemplates.Success(
						`Successfully reloaded \`${commandName}\` command`,
						message
					)
				]
			});
		else
			return interaction.editReply({
				embeds: [
					EmbedTemplates.CommandInternalError(
						message,
						"There was an error reloading a command"
					)
				]
			});
	}
}

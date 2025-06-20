import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	Colors,
	EmbedBuilder,
	SlashCommandStringOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class DeleteCommand implements ICommand {
	public readonly Name: Lowercase<string> = "delete";
	public readonly Description: string = "[DEV] Delete a command from the bot";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandStringOption()
			.setName("name")
			.setDescription("The name of the command to delete")
			.setRequired(true)
	];
	public readonly Developer?: boolean | undefined = true;

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const commandName = interaction.options.getString("name", true);

		const [success, message] = await this.Grant.Bot.DeleteCommand(
			commandName
		);

		const embed = new EmbedBuilder();

		if (success)
			return interaction.editReply({
				embeds: [
					embed
						.setTitle("Success")
						.setDescription(
							`Successfully deleted \`${commandName}\` command`
						)
						.setFields([
							{ name: "Message", value: `\`\`\`${message}\`\`\`` }
						])
						.setColor(Colors.Green)
				]
			});
		else
			return interaction.editReply({
				embeds: [
					embed
						.setTitle("Error")
						.setDescription("There was an error deleting a command")
						.setFields([
							{ name: "Message", value: `\`\`\`${message}\`\`\`` }
						])
						.setColor(Colors.Red)
				]
			});
	}
}

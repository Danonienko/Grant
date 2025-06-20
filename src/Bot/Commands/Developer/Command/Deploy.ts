import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	Colors,
	EmbedBuilder,
	SlashCommandStringOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class DeployCommand implements ICommand {
	public readonly Name: Lowercase<string> = "deploy";
	public readonly Description: string = "[DEV] Deploy a command into a bot";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandStringOption()
			.setName("name")
			.setDescription("The name of the command")
			.setRequired(true)
	];
	public readonly Developer?: boolean | undefined = true;

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const commandName = interaction.options.getString("name", true);

		const [success, message] = await this.Grant.Bot.DeployCommand(
			commandName
		);

		const embed = new EmbedBuilder();

		if (success)
			return interaction.editReply({
				embeds: [
					embed
						.setTitle("Success")
						.setDescription(
							`Command \`${commandName}\` has been successfully deployed`
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
						.setDescription(
							"There was an error deploying a command"
						)
						.setFields([
							{ name: "Message", value: `\`\`\`${message}\`\`\`` }
						])

						.setColor(Colors.Red)
				]
			});
	}
}

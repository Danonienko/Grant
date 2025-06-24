import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	SlashCommandStringOption
} from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class EchoCommand implements ICommand {
	public readonly Name: Lowercase<string> = "echo";
	public readonly Description: string =
		"Echoes back with whatever string you inputted";
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandStringOption()
			.setName("input")
			.setDescription("The text to echo back")
			.setRequired(true)
	];

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction) {
		const input = interaction.options.getString("input", true);

		return interaction.reply(input);
	}
}

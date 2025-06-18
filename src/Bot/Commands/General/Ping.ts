import { ChatInputCommandInteraction } from "discord.js";
import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class PingCommand implements ICommand {
	public readonly Grant: Grant;

	public readonly Name: Lowercase<string> = "ping";
	public readonly Description: string = "Replies with pong!";

	public constructor(grant: Grant) {
		this.Grant = grant;
	}

	public async Execute(interaction: ChatInputCommandInteraction<"cached">) {
		return interaction.reply("Pong!");
	}
}

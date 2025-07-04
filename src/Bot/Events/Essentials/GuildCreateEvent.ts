import { ClientEvents } from "discord.js";
import Grant from "index.js";
import { IEvent } from "Types/Globals.js";

export default class GuildCreateEvent implements IEvent {
	public readonly Name: keyof ClientEvents = "guildCreate";

	public constructor(public readonly Grant: Grant) {}

	public async Execute() {
		await this.Grant.Bot.DeployCommands();
	}
}

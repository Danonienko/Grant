import { Events } from "discord.js";
import Grant from "index.js";
import { IEvent } from "Types/Globals.js";

export default class GuildCreateEvent implements IEvent {
	public readonly Name: Events = Events.GuildCreate;

	public constructor(public readonly Grant: Grant) {}

	public async Execute() {
		await this.Grant.Bot.DeployCommands();
	}
}

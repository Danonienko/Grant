import { ActivityType, Client, Events } from "discord.js";
import Grant from "index.js";
import { IEvent } from "Types/Globals.js";

export default class ReadyEvent implements IEvent {
	public readonly Name: Events = Events.ClientReady;
	public readonly Once?: boolean | undefined = true;

	public constructor(public readonly Grant: Grant) {}

	public async Execute(client: Client) {
		this.Grant.Log.Info(`Client ready! Logged in as ${client.user?.tag}`);

		client.user?.setPresence({
			status: "online",
			activities: [
				{
					name: "NFSF",
					type: ActivityType.Watching
				}
			]
		});
	}
}

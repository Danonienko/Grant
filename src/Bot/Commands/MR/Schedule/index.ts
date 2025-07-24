import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class ScheduleIndexCommand implements ICommand {
	public readonly Name: Lowercase<string> = "schedule";
	public readonly Description: string =
		"Schedule an event for everyone to see.";
	public readonly IsIndexer?: boolean | undefined = true;

	public constructor(public readonly Grant: Grant) {}

	public async Execute() {
		Promise.resolve();
	}
}

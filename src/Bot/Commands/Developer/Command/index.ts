import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class CommandIndexCommand implements ICommand {
	public readonly Name: Lowercase<string> = "command";
	public readonly Description: string =
		"[DEV] A command group to manage the bot's commands";
	public readonly Developer?: boolean | undefined = true;
	public readonly IsIndexer?: boolean | undefined = true;

	public constructor(public readonly Grant: Grant) {}

	public async Execute() {
		return Promise.resolve();
	}
}

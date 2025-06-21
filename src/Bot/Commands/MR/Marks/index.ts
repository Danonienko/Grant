import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class MarksIndexCommand implements ICommand {
	public readonly Name: Lowercase<string> = "marks";
	public readonly Description: string = "Manage marks of the officers";
	public readonly IsIndexer?: boolean | undefined = true;

	public constructor(public readonly Grant: Grant) {}

	public async Execute() {
		return Promise.resolve();
	}
}

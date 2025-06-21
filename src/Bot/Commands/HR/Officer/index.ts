import Grant from "index.js";
import { ICommand } from "Types/Globals.js";

export default class OfficerIndexCommand implements ICommand {
	public readonly Name: Lowercase<string> = "officer";
	public readonly Description: string = "Manages officers";
	public readonly IsIndexer?: boolean | undefined = true;

	public constructor(public readonly Grant: Grant) {}

	public async Execute() {
		return Promise.resolve();
	}
}

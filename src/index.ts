import Logger from "./Util/Log.js";
import Bot from "./Bot/Bot.js";
import { configDotenv } from "dotenv";

class GrantObject {
	public readonly Bot: Bot;
	public readonly Log: Logger;
	public readonly Environment = configDotenv().parsed!;

	public readonly BotDevelopers: string[] = ["427832787605782549"];

	public constructor() {
		this.Log = new Logger("Grant", this);
		this.Bot = new Bot(this);
	}
}

const Grant = new GrantObject();
type Grant = typeof Grant;

export default Grant;

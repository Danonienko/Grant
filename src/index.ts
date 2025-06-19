import Logger from "./Util/Log.js";
import Bot from "./Bot/Bot.js";
import { configDotenv } from "dotenv";

class GrantObject {
	public readonly Bot: Bot;
	public readonly Log: Logger;
	public readonly Environment = configDotenv().parsed!;

	public constructor() {
		this.Log = new Logger("Grant", this);
		this.Bot = new Bot(this);
	}
}

const Grant = new GrantObject();
type Grant = typeof Grant;

export default Grant;

import Bot from "./Bot/Bot.js";
import { configDotenv } from "dotenv";

class GrantObject {
	public readonly Bot: Bot;
	public readonly Environment = configDotenv().parsed!;

	public constructor() {
		this.Bot = new Bot(this);
	}
}

const Grant = new GrantObject();

type Grant = typeof Grant;

export default Grant;

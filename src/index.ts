import Logger from "Util/Log.js";
import Bot from "Bot/Bot.js";
import { Environment } from "Types/Globals.js";
import { configDotenv } from "dotenv";

class GrantObject {
	public readonly Bot: Bot;
	public readonly Log: Logger;
	public readonly Environment: Environment;

	public readonly BotDevelopers: string[] = ["427832787605782549"];

	public constructor() {
		this.Environment = this._ParseEnvironment();
		this.Log = new Logger("Grant", this);
		this.Bot = new Bot(this);
	}

	private _ParseEnvironment(): Environment {
		console.info("Parsing environment...");

		let env = process.env as Environment;

		if (env.ENVIRONMENT !== "production") {
			const parsedEnv = configDotenv().parsed as Environment;
			console.info("Current Environment:", parsedEnv.ENVIRONMENT);
			return parsedEnv;
		}

		console.info("Current Environment:", env.ENVIRONMENT);
		
		return env;
	}
}

const Grant = new GrantObject();
type Grant = typeof Grant;

export default Grant;

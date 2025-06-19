import chalk from "chalk";
import Grant from "index.js";
import moment from "moment";

export default class Logger {
	public readonly Name: string;
	public readonly Grant: Grant;

	public constructor(name: string, grant: Grant) {
		this.Name = name;
		this.Grant = grant;
	}

	private async _base(type: string, ...args: any[]): Promise<void> {
		console.log(
			`${chalk.gray("[")} ${chalk.blueBright(this.Name)} ${chalk.gray(
				":"
			)} ${type} ${chalk.gray("]")}` +
				`${chalk.gray("[")} ${chalk.greenBright(
					moment().format("hh:mm:ss")
				)} ${chalk.gray("]")}` +
				`: ${args.join(", ")}`
		);
	}

	public async Info(...args: any[]): Promise<void> {
		await this._base(chalk.blueBright("INFO"), ...args);
	}

	public async Warn(...args: any[]): Promise<void> {
		await this._base(chalk.yellowBright("WARN"), ...args);
	}

	public async Error(...args: any[]): Promise<void> {
		await this._base(chalk.redBright("ERROR"), ...args);
	}

	public async Critical(...args: any[]): Promise<void> {
		await this._base(chalk.red("CRITICAL"), ...args);
	}

	public async Debug(...args: any[]): Promise<void> {
		await this._base(chalk.greenBright("DEBUG"), ...args);
	}
}

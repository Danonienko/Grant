import {
	Client,
	Collection,
	REST,
	RESTPostAPIApplicationCommandsJSONBody,
	Routes,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	Snowflake
} from "discord.js";
import { lstat, readdir } from "fs/promises";
import Grant from "index.js";
import knex, { Knex } from "knex";
import { ICommand, IEvent } from "Types/Globals.js";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default class Bot extends Client {
	public readonly REST: REST = new REST();
	public readonly Knex: Knex;
	public readonly Commands: Collection<string, ICommand> = new Collection();
	public readonly Events: Collection<string, IEvent> = new Collection();

	public constructor(public readonly Grant: Grant) {
		super({
			intents: [
				"Guilds",
				"MessageContent",
				"GuildMessages",
				"DirectMessages",
				"GuildMembers",
				"DirectMessageReactions",
				"DirectMessageTyping",
				"GuildBans",
				"GuildExpressions",
				"GuildIntegrations",
				"GuildEmojisAndStickers",
				"GuildInvites",
				"GuildModeration",
				"GuildPresences",
				"GuildMessageReactions"
			]
		});

		this.REST.setToken(this.Grant.Environment.TOKEN);

		this.Knex = knex({
			client: "mysql2",
			connection: {
				host: this.Grant.Environment.RDS_HOST,
				port: Number(this.Grant.Environment.RDS_PORT),
				user: this.Grant.Environment.RDS_USER,
				password: this.Grant.Environment.RDS_PASSWORD,
				database: this.Grant.Environment.RDS_DATABASE
			}
		});

		this._start();
	}

	private async _start(): Promise<void> {
		await this._testConnection();
		await this.ReadEvents();
		await this.RegisterEvents();
		await this.LoadCommands();

		this.login(this.Grant.Environment.TOKEN);
	}

	private async _testConnection(): Promise<void> {
		try {
			this.Grant.Log.Info("Connecting to database...");
			await this.Knex.raw("SELECT 1 + 1 AS result");
			this.Grant.Log.Info("Successfully connected to AWS RDS MySQL");
		} catch (error) {
			this.Grant.Log.Error(
				`Failed to connect to AWS RDS MySQL: ${error}`
			);
			throw error;
		}
	}

	private async _buildCommand(
		command: ICommand
	): Promise<RESTPostAPIApplicationCommandsJSONBody> {
		const slashCommand = new SlashCommandBuilder();

		slashCommand.setName(command.Name);
		slashCommand.setDescription(command.Description);

		for (const option of command.Options ?? []) {
			slashCommand.options.push(option);
		}

		if (command.SubCommands) {
			for (const subCommand of command.SubCommands) {
				const slashSubCommand = new SlashCommandSubcommandBuilder();

				slashSubCommand.setName(subCommand.Name);
				slashSubCommand.setDescription(subCommand.Description);

				for (const subCommandOption of subCommand.Options ?? []) {
					slashSubCommand.options.push(subCommandOption);
				}

				slashCommand.addSubcommand(slashSubCommand);
			}
		}

		return slashCommand.toJSON();
	}

	public async LoadCommands(): Promise<void> {
		try {
			this.Grant.Log.Info("Loading commands...");

			const categoryDirs = await readdir(`${__dirname}/Commands`);

			for (const categoryDir of categoryDirs) {
				const commands = await readdir(
					`${__dirname}/Commands/${categoryDir}`
				);

				for (const command of commands) {
					this.Grant.Log.Debug(`Loading '${command}' command`);

					const commandStat = await lstat(
						`${__dirname}/Commands/${categoryDir}/${command}`
					);

					const commandClass = (
						await import(
							`./Commands/${categoryDir}/${command}${
								commandStat.isDirectory() ? "/index.js" : ""
							}`
						)
					).default;

					if (commandClass == undefined) continue;

					const commandData: ICommand = new commandClass(this.Grant);

					if (commandData.IsIndexer) {
						this.Grant.Log.Debug(
							`Detected '${commandData.Name}' as indexer.`
						);

						if (!commandData.SubCommands)
							commandData.SubCommands = [];

						const subCommands = await readdir(
							`${__dirname}/Commands/${categoryDir}/${command}`
						);

						this.Grant.Log.Debug(
							`Loading subcommands of '${commandData.Name}'`
						);

						for (const subCommand of subCommands) {
							this.Grant.Log.Debug(
								`Loading '${subCommand}' subcommand`
							);

							const subCommandClass = (
								await import(
									`./Commands/${categoryDir}/${command}/${subCommand}`
								)
							).default;

							if (subCommandClass == undefined) continue;

							const subCommandData: ICommand =
								new subCommandClass(this.Grant);

							if (subCommandData.IsIndexer) {
								this.Grant.Log.Debug(
									`Skipped '${subCommand}' because it is an indexer`
								);
								continue;
							}

							commandData.SubCommands.push(subCommandData);
						}

						this.Grant.Log.Debug(
							`Subcommands of '${commandData.Name}' command loaded.`
						);
					}

					this.Commands.set(commandData.Name, commandData);
				}
			}

			this.Grant.Log.Info("Commands loaded.");
		} catch (error) {
			this.Grant.Log.Error(error);
			throw error;
		}
	}

	public async DeployCommands(): Promise<[boolean, string]> {
		try {
			this.Grant.Log.Info("Building commands...");

			const parsedCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];

			let count = 0;

			for (const command of this.Commands.values()) {
				count += 1;

				this.Grant.Log.Debug(
					`Building '${command.Name}' command (${count}/${this.Commands.size})`
				);

				const builtCommand = await this._buildCommand(command);

				parsedCommands.push(builtCommand);
			}

			this.Grant.Log.Info("Commands built.");
			this.Grant.Log.Info("Deploying commands...");

			this.REST.put(
				Routes.applicationGuildCommands(
					this.Grant.Environment.CLIENT,
					this.Grant.Environment.GUILD
				),
				{
					body: parsedCommands
				}
			);

			this.Grant.Log.Info("Commands deployed.");

			return [true, "Success"];
		} catch (error) {
			this.Grant.Log.Error(error);
			return [false, String(error)];
		}
	}

	public async DeployCommand(
		commandName: string
	): Promise<[boolean, string]> {
		try {
			const command = this.Commands.get(commandName);

			if (!command)
				return [
					false,
					`No command under the name '${commandName}' been found`
				];

			await this.REST.post(
				Routes.applicationGuildCommands(
					this.Grant.Environment.CLIENT,
					this.Grant.Environment.GUILD
				),
				{
					body: await this._buildCommand(command)
				}
			);

			return [true, "Success"];
		} catch (error) {
			this.Grant.Log.Error(error);
			throw error;
		}
	}

	public async ReloadCommand(
		commandName: string
	): Promise<[boolean, string]> {
		try {
			const command = this.Commands.get(commandName);

			if (!command)
				return [
					false,
					`No command under the name '${commandName}' been found.`
				];

			const apiCommands = (await this.REST.get(
				Routes.applicationGuildCommands(
					this.Grant.Environment.CLIENT,
					this.Grant.Environment.GUILD
				)
			)) as { id: Snowflake; name: string }[];

			const apiCommand = apiCommands.find((c) => c.name == commandName);

			if (!apiCommand)
				return [false, "Could not find command in the API"];

			await this.REST.patch(
				Routes.applicationGuildCommand(
					this.Grant.Environment.CLIENT,
					this.Grant.Environment.GUILD,
					apiCommand.id
				),
				{
					body: await this._buildCommand(command)
				}
			);

			return [true, "Success"];
		} catch (error) {
			this.Grant.Log.Error();
			throw error;
		}
	}

	public async DeleteCommand(
		commandName: string
	): Promise<[boolean, string]> {
		try {
			const apiCommands = (await this.REST.get(
				Routes.applicationGuildCommands(
					this.Grant.Environment.CLIENT,
					this.Grant.Environment.GUILD
				)
			)) as { name: string; id: Snowflake }[];

			const apiCommand = apiCommands.find((c) => c.name == commandName);

			if (!apiCommand)
				return [false, "Could not find command in the API."];

			await this.REST.delete(
				Routes.applicationGuildCommand(
					this.Grant.Environment.CLIENT,
					this.Grant.Environment.GUILD,
					apiCommand.id
				)
			);

			return [true, "Success"];
		} catch (error) {
			this.Grant.Log.Error(error);
			throw error;
		}
	}

	public async DeleteAllCommands(): Promise<void> {
		const route = Routes.applicationGuildCommands(
			this.Grant.Environment.CLIENT,
			this.Grant.Environment.GUILD
		);

		const commands = (await this.REST.get(route)) as { id: string }[];

		let count = 0;

		this.Grant.Log.Info("Deleting commands...");

		for (const command of commands) {
			count += 1;

			setTimeout(async () => {
				await this.REST.delete(
					Routes.applicationGuildCommand(
						this.Grant.Environment.CLIENT,
						this.Grant.Environment.GUILD,
						command.id
					)
				);
			}, 0.5);

			this.Grant.Log.Debug(`Deleting... (${count}/${commands.length})`);
		}

		this.Grant.Log.Info("Commands deleted.");
	}

	public async ReadEvents(): Promise<void> {
		try {
			this.Grant.Log.Info("Reading events...");

			const categoryDirs = await readdir(`${__dirname}/Events`);

			for (const categoryDir of categoryDirs) {
				const events = await readdir(
					`${__dirname}/Events/${categoryDir}`
				);

				for (const event of events) {
					this.Grant.Log.Debug(`Reading '${event}' event`);

					const eventClass = (
						await import(`./Events/${categoryDir}/${event}`)
					).default;

					const eventData: IEvent = new eventClass(this.Grant);

					this.Events.set(eventData.Name, eventData);
				}
			}

			this.Grant.Log.Info("Events read.");
		} catch (error) {
			this.Grant.Log.Error(error);
			throw error;
		}
	}

	public async RegisterEvents(): Promise<void> {
		try {
			this.Grant.Log.Info(`Registering events...`);

			for (const event of this.Events.values()) {
				this.Grant.Log.Debug(`Registering '${event.Name}' event`);

				if (event.Once) this.once(event.Name, event.Execute);
				else this.on(event.Name, event.Execute);
			}

			this.Grant.Log.Info("Events registered.");
		} catch (error) {
			this.Grant.Log.Error(error);
			throw error;
		}
	}
}

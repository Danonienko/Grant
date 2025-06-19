import {
	Client,
	Collection,
	REST,
	RESTPostAPIApplicationCommandsJSONBody,
	Routes,
	SlashCommandBuilder
} from "discord.js";
import { readdir } from "fs/promises";
import Grant from "index.js";
import knex, { Knex } from "knex";
import { ICommand, IEvent } from "Types/Globals.js";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default class Bot extends Client {
	public readonly Grant: Grant;
	public readonly REST: REST = new REST();
	public readonly Knex: Knex;
	public readonly Commands: Collection<string, ICommand> = new Collection();
	public readonly Events: Collection<string, IEvent> = new Collection();

	public constructor(grant: Grant) {
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

		this.Grant = grant;
		this.REST.setToken(this.Grant.Environment.TOKEN);

		try {
			this.Grant.Log.Info("Connecting to database...");

			this.Knex = knex({
				client: "better-sqlite3",
				useNullAsDefault: true,
				connection: {
					filename: "./Data/Grant.sqlite"
				}
			});

			this.Grant.Log.Info("Connection established.");
		} catch (error) {
			this.Grant.Log.Error(error);
			throw error;
		}

		this._start();
	}

	private async _start(): Promise<void> {
		await this.ReadEvents();
		await this.RegisterEvents();
		await this.LoadCommands();

		this.login(this.Grant.Environment.TOKEN);
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

					const commandClass = (
						await import(`./Commands/${categoryDir}/${command}`)
					).default;

					if (commandClass == undefined) continue;

					const commandData: ICommand = new commandClass(this.Grant);

					this.Commands.set(commandData.Name, commandData);
				}
			}

			this.Grant.Log.Info("Commands loaded.");
		} catch (error) {
			this.Grant.Log.Error(error);
			throw error;
		}
	}

	public async DeployCommands(): Promise<void> {
		try {
			this.Grant.Log.Info("Building commands...");

			const parsedCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];

			let count = 0;

			for (const command of this.Commands.values()) {
				count += 1;

				this.Grant.Log.Debug(
					`Building '${command.Name}' command (${count}/${this.Commands.size})`
				);

				const slashCommand = new SlashCommandBuilder();

				slashCommand.setName(command.Name);
				slashCommand.setDescription(command.Description);

				for (const option of command.Options || [])
					slashCommand.options.push(option);

				parsedCommands.push(slashCommand.toJSON());
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

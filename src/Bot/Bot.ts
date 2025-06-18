import {
	Client,
	Collection,
	REST,
	RESTPostAPIApplicationCommandsJSONBody,
	Routes,
	SlashCommandBuilder
} from "discord.js";
import { lstat, readdir } from "fs/promises";
import Grant from "index.js";
import { CommandList, EventList, ICommand, IEvent } from "Types/Globals.js";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default class Bot extends Client {
	public readonly Grant: Grant;
	public readonly REST: REST = new REST();

	public Commands: CommandList = new Collection();
	public Events: EventList = new Collection();

	constructor(grant: Grant) {
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

		this.RegisterCommands();
		this.RegisterEvents();

		this.login(this.Grant.Environment.TOKEN);
	}

	public async GetCommand(
		commandName: string
	): Promise<ICommand | undefined> {
		let command: ICommand | undefined;

		this.Commands.forEach((category) => {
			command = category.get(commandName);
		});

		return command;
	}

	public async ReadCommands(): Promise<CommandList> {
		console.log("Reading commands...");

		const commandList: CommandList = new Collection();

		try {
			const categoryDirs = await readdir(`${__dirname}/Commands`);

			for (const categoryDir of categoryDirs) {
				const category = new Collection<string, ICommand>();
				const commands = await readdir(
					`${__dirname}/Commands/${categoryDir}`
				);

				for (const command of commands) {
					const commandStat = await lstat(
						`${__dirname}/Commands/${categoryDir}/${command}`
					);
					const commandClass = (
						await import(
							`./Commands/${categoryDir}/${command}${
								(commandStat.isDirectory() && "/index.js") || ""
							}`
						)
					).default;
					const commandData: ICommand = new commandClass(this.Grant);

					if (commandStat.isDirectory()) {
						if (!commandData.SubCommands)
							commandData.SubCommands = [];

						commandData.IsIndexer = true;
					}

					category.set(commandData.Name, commandData);
				}

				commandList.set(categoryDir, category);
			}

			console.log("Read all commands.");

			return commandList;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	public async RegisterCommands(): Promise<void> {
		try {
			const commandList = await this.ReadCommands();
			this.Commands = commandList;

			const parsedCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];

			console.info("Building commands...");

			commandList.forEach((category, categoryName) => {
				console.log(`Building '${categoryName}' command category`);

				category.forEach((command) => {
					console.log(`Building '${command.Name}' command`);

					parsedCommands.push(
						new SlashCommandBuilder()
							.setName(command.Name)
							.setDescription(command.Description)
							.toJSON()
					);
				});
			});

			console.log("Registering commands...");

			this.REST.put(
				Routes.applicationGuildCommands(
					this.Grant.Environment.CLIENT,
					this.Grant.Environment.GUILD
				),
				{
					body: parsedCommands
				}
			);
			console.info("Commands have been successfully registered!");
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	public async ReadEvents(): Promise<EventList> {
		console.log("Reading events...");

		const eventList: EventList = new Collection();

		try {
			const categoryDirs = await readdir(`${__dirname}/Events`);

			for (const categoryDir of categoryDirs) {
				const category = new Collection<string, IEvent>();
				const events = await readdir(
					`${__dirname}/Events/${categoryDir}`
				);

				for (const event of events) {
					const eventClass = (
						await import(`./Events/${categoryDir}/${event}`)
					).default;

					const eventData: IEvent = new eventClass(this.Grant);

					category.set(eventData.Name, eventData);
				}

				eventList.set(categoryDir, category);
			}
		} catch (error) {
			console.log(error);
			throw error;
		}

		console.log("Read all events.");

		return eventList;
	}

	public async RegisterEvents(): Promise<void> {
		try {
			const eventList = await this.ReadEvents();
			this.Events = eventList;

			console.info(`Registering events...`);

			eventList.forEach((category, categoryName) => {
				console.info(`Registering '${categoryName}' event category`);

				category.forEach((event) => {
					console.log(`Registering '${event.Name}' event`);

					if (event.Once) this.once(event.Name, event.Execute);
					else this.on(event.Name, event.Execute);
				});
			});

			console.info("Events have been successfully registered!");
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}

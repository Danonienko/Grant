import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	ClientEvents,
	Collection
} from "discord.js";
import Grant from "index.js";

export interface ICommand {
	readonly Grant: Grant;

	readonly Name: Lowercase<string>;
	readonly Description: string;
	readonly Options?: ApplicationCommandOptionBase[];
	readonly Developer?: boolean;
	readonly IsIndexer?: boolean;

	SubCommands?: ICommand[];

	Execute(interaction: ChatInputCommandInteraction);
	AutoComplete?(interaction: ChatInputCommandInteraction);
}

export interface IEvent {
	readonly Grant: Grant;

	readonly Name: keyof ClientEvents;
	readonly Once?: boolean;

	Execute(...args: any[]);
}

export type Environment = {
	TOKEN: string;
	CLIENT: string;
	GUILD: string;
	ENVIRONMENT: string;
	DATABASE_URL: string;
};

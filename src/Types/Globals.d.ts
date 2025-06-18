import { ChatInputCommandInteraction, Collection } from "discord.js";
import Grant from "index";

export interface ICommand {
	readonly Grant: Grant;

	readonly Name: Lowercase<string>;
	readonly Description: string;
	readonly Developer?: boolean;
	SubCommands?: ICommand[];
	IsIndexer?: boolean;

	Execute(interaction: ChatInputCommandInteraction);
	AutoComplete?(interaction: ChatInputCommandInteraction);
}

export interface IEvent {
	readonly Name: Events;
	readonly Grant: Grant;
	readonly Once?: boolean;

	Execute(...args: any[]);
}

export type CommandList = Collection<string, Collection<string, ICommand>>;
export type EventList = Collection<string, Collection<string, IEvent>>;

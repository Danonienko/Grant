import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	Collection
} from "discord.js";
import Grant from "index";

export interface ICommand {
	readonly Grant: Grant;

	readonly Name: Lowercase<string>;
	readonly Description: string;
	readonly Options?: ApplicationCommandOptionBase[];
	readonly Developer?: boolean;

	SubCommands?: ICommand[];
	IsIndexer?: boolean;

	Execute(interaction: ChatInputCommandInteraction);
	AutoComplete?(interaction: ChatInputCommandInteraction);
}

export interface IEvent {
	readonly Grant: Grant;

	readonly Name: Events;
	readonly Once?: boolean;

	Execute(...args: any[]);
}
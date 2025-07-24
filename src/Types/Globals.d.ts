import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	ClientEvents,
	Collection
} from "discord.js";
import Grant from "index.js";
import { Ranks } from "Util/Ranks.ts";

export interface ICommand {
	/** The Grant class object */
	readonly Grant: Grant;

	/** Name of the command in lowercase */
	readonly Name: Lowercase<string>;
	/** Description of the command */
	readonly Description: string;
	/** The options of the command */
	readonly Options?: ApplicationCommandOptionBase[];
	/** The roles that can execute the command */
	readonly Roles?: string[];
	/** If set to `true`, only bot developer can execute the command */
	readonly Developer?: boolean;
	/** Set to `true` if the command is an indexer of the sub-command */
	readonly IsIndexer?: boolean;

	/** **Don't touch**. The sub-commands of the command */
	SubCommands?: ICommand[];

	Execute(interaction: ChatInputCommandInteraction<"cached">);
	AutoComplete?(interaction: ChatInputCommandInteraction<"cached">);
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
	CONFIG_URL: string;
};

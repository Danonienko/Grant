import { EmbedBuilder } from "@discordjs/builders";
import { Colors } from "discord.js";

export const FooterTemplates = {
	Version: { text: "Grant v1.0.0" }
} as const;

export type FooterTemplates = typeof FooterTemplates;

const EmbedTemplates = {
	CommandNotImplemented: new EmbedBuilder()
		.setTitle("Command Not Implemented")
		.setDescription(
			`This command is not yet implemented. 
			Usually, it should not be deployed, so I suggest you to ping a Bot Developer.`
		)
		.setColor(Colors.Yellow)
		.setTimestamp()
		.setFooter(FooterTemplates.Version),
	CommandError: (commandName: string, errorMessage: string) => {
		return new EmbedBuilder()
			.setTitle("Command Error")
			.setDescription(
				`There was an error executing '${commandName}' command`
			)
			.addFields([
				{ name: "Message", value: `\`\`\`${errorMessage}\`\`\`` }
			])
			.setColor(Colors.Red)
			.setTimestamp()
			.setFooter(FooterTemplates.Version);
	},
	InternalError: (errorMessage: string) => {
		return new EmbedBuilder()
			.setTitle("Internal Error")
			.setDescription(`An internal error occurred`)
			.addFields([
				{
					name: "Message",
					value: `\`\`\`${errorMessage}\`\`\``
				}
			])
			.setColor(Colors.DarkRed)
			.setTimestamp()
			.setFooter(FooterTemplates.Version);
	},
	CommandNotFound: (commandName: string, isSubCommand?: boolean) => {
		return new EmbedBuilder()
			.setTitle(`${isSubCommand ? "Subcommand" : "Command"} Not Found`)
			.setDescription(
				`No ${
					isSubCommand ? "subcommand" : "command"
				} matching \`${commandName}\` was found`
			)
			.setColor(Colors.Orange)
			.setTimestamp()
			.setFooter(FooterTemplates.Version);
	},
	CommandInternalError: (errorMessage: string, description?: string) => {
		return new EmbedBuilder()
			.setTitle("Internal Command Error")
			.setDescription(
				description ? description : "The command encountered an error"
			)
			.addFields([
				{ name: "Message", value: `\`\`\`${errorMessage}\`\`\`` }
			])
			.setColor(Colors.DarkOrange)
			.setTimestamp()
			.setFooter(FooterTemplates.Version);
	},
	Success: (description?: string, message?: string) => {
		return new EmbedBuilder()
			.setTitle("Success")
			.setDescription(
				description ? description : "Command executed successfully"
			)
			.addFields(
				message
					? [{ name: "Message", value: `\`\`\`${message}\`\`\`` }]
					: []
			)
			.setColor(Colors.Green)
			.setTimestamp()
			.setFooter(FooterTemplates.Version);
	}
} as const;

type EmbedTemplates = typeof EmbedTemplates;

export default EmbedTemplates;

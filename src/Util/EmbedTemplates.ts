import { EmbedBuilder } from "@discordjs/builders";
import { Colors } from "discord.js";
import ImageURLs from "./ImageURLs.js";

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

	SubCommandNotImplemented: new EmbedBuilder()
		.setTitle("Subcommand Not Implemented")
		.setDescription("This subcommand is not yet implemented.")
		.setColor(Colors.Yellow)
		.setTimestamp()
		.setFooter(FooterTemplates.Version),

	Denied: new EmbedBuilder()
		.setTitle("DENIED")
		.setDescription(
			"Your rank is too low to be able to execute this command"
		)
		.setColor(Colors.Red)
		.setTimestamp()
		.setThumbnail(ImageURLs.Denied)
		.setFooter(FooterTemplates.Version),

	DeniedMaly: new EmbedBuilder()
		.setTitle("DENIED")
		.setDescription(
			"Please enter your ROBLOSECURITY code, full name, date of birth and credit card information to use this command :3"
		)
		.setTimestamp()
		.setThumbnail(ImageURLs.Denied)
		.setColor(Colors.Red)
		.setFooter(FooterTemplates.Version),

	OfficerNotFound: (username: string) => {
		return new EmbedBuilder()
			.setTitle("Officer Not Found")
			.setDescription(
				`Could not find ${username} in the database. 
- If officer is part of NFSF, check if they are registered with \`/officer register\` command
- If officer is registered but still cannot be found, contact Bot Developer`
			)
			.setTimestamp()
			.setColor(Colors.Yellow)
			.setFooter(FooterTemplates.Version);
	},

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

	Error: (errorMessage: string, description?: string) => {
		return new EmbedBuilder()
			.setTitle("Error")
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

import { randomUUID } from "crypto";
import {
	ApplicationCommandOptionBase,
	ChatInputCommandInteraction,
	Colors,
	EmbedBuilder,
	SlashCommandNumberOption,
	SlashCommandStringOption
} from "discord.js";
import Grant from "index.js";
import { scheduleJob } from "node-schedule";
import { ICommand } from "Types/Globals.js";
import { FooterTemplates } from "Util/EmbedTemplates.js";
import { Ranks } from "Util/Ranks.js";

const CHANNEL_ID = "576516986486521879";

export default class ScheduleAddCommand implements ICommand {
	public readonly Name: Lowercase<string> = "add";
	public readonly Description: string = "Schedule a new event";
	public readonly Roles?: string[] | undefined = Ranks.MRAndHigher;
	public readonly Options?: ApplicationCommandOptionBase[] | undefined = [
		new SlashCommandStringOption()
			.setName("name")
			.setDescription("The name of the event. Will be used as a title")
			.setRequired(true),
		new SlashCommandNumberOption()
			.setName("epoch")
			.setDescription("The Unix timestamp of when the event starts")
			.setRequired(true)
	];

	public constructor(public readonly Grant: Grant) {}

	public async Execute(interaction: ChatInputCommandInteraction<"cached">) {
		await interaction.deferReply();

		const knex = this.Grant.Bot.Knex;

		const eventName = interaction.options.getString("name", true);
		const timestamp = interaction.options.getNumber("epoch", true);
		const eventDate = new Date(timestamp * 1000);

		if (eventDate.getTime() < Date.now())
			return interaction.editReply(
				"You cannot schedule an event in the past, imbecile."
			);

		const job = scheduleJob(eventName, eventDate, async () => {
			try {
				this.Grant.Log.Debug(
					`Invoking a scheduled job: ${eventName} (${eventDate.toDateString()})`
				);

				const channel =
					interaction.guild.channels.cache.get(CHANNEL_ID);

				if (!channel || !channel.isTextBased()) return;

				await channel.send({
					embeds: [
						new EmbedBuilder()
							.setTitle(`${eventName} is starting!`)
							.setDescription(
								"A scheduled event is now starting!"
							)
							.setFooter(FooterTemplates.Version)
							.setTimestamp()
							.setColor(Colors.Green)
					]
				});

				await knex<Events>("Events").delete().where("EventID", uuid);

				job.cancel(false);
			} catch (error) {
				this.Grant.Log.Error(`Failed to invoke a job: ${error}`);

				await knex<Events>("Events").update(
					"ErrorMessage",
					String(error)
				);

				job.cancel(false);
			}
		});

		const uuid = randomUUID();

		await knex<Events>("Events").insert({
			EventID: uuid,
			EventName: eventName,
			HostName: interaction.user.displayName,
			Timestamp: timestamp
		});

		const scheduledEvent = await knex<Events>("Events")
			.select("*")
			.where("EventID", uuid)
			.first();

		if (!scheduledEvent)
			return interaction.editReply("Failed to schedule an event");

		return interaction.editReply("Successfully scheduled an event");
	}
}

/**
 * The configuration schema for Grant Discord Bot
 */
declare interface GrantConfig {
	/**
	 * The settings for the 'Schedule' command
	 */
	Schedule: Schedule;
	[property: string]: any;
}

/**
 * The settings for the 'Schedule' command
 */
declare interface Schedule {
	/**
	 * The channel where the start of scheduled event will be announced to
	 */
	ScheduleAnnounceChannel: string;
	/**
	 * The channel where the list of scheduled events will be posted to
	 */
	ScheduleListChannel: string;
	[property: string]: any;
}

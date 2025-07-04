declare interface Officer {
	OfficerID: number;
	Discord_Username: string;
	Discord_ID: string;
	Marks: number;
}

declare interface Events {
	EventID: number;
	EventType: string;
	Host: string;
	Host_DiscordID: string;
	Epoch: string;
	IsConcluded: boolean;
}

declare interface Officer {
	OfficerID: number;
	Discord_Username: string;
	Discord_ID: string;
	Marks: number;
}

declare module "knex/types/tables" {
	interface Tables {
		Officers: Officer;
	}
}

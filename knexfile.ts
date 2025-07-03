import type { Knex } from "knex";

// Update with your config settings.

const knexConfig: { [key: string]: Knex.Config } = {
	development: {
		client: "better-sqlite3",
		connection: {
			filename: "src/Data/GrantDB.sqlite"
		},
		useNullAsDefault: true,
		migrations: {
			directory: "src/Data/Migrations"
		},
		seeds: {
			directory: "src/Data/Seeds"
		}
	},

	staging: {
		client: "better-sqlite3",
		connection: {
			filename: "src/Data/GrantDB.sqlite"
		},
		useNullAsDefault: true,
		migrations: {
			directory: "src/Data/Migrations"
		},
		seeds: {
			directory: "src/Data/Seeds"
		}
	},

	production: {
		client: "better-sqlite3",
		connection: {
			filename: "src/Data/GrantDB.sqlite"
		},
		useNullAsDefault: true,
		migrations: {
			directory: "src/Data/Migrations"
		},
		seeds: {
			directory: "src/Data/Seeds"
		}
	}
};

export default knexConfig;


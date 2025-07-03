import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("Officers", (table) => {
		table.increments("OfficerID").primary();
		table.string("Discord_Username").notNullable().unique();
		table.string("Discord_ID").notNullable().unique();
		table.string("Marks").notNullable().defaultTo(0);
		table.timestamps(true, true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists("Officers");
}


import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTableIfNotExists('connections', (table)=>{
    table.increments('id').primary();
    
    table.integer('user_id').notNullable().references('users.id').onUpdate('CASCADE').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.raw(`(datetime('now', 'localtime'))`));
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('connections');
}


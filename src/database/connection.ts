import knex from 'knex';
const db = knex({
  client: 'sqlite',
  connection: { 
    filename: './src/database/database.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './src/database/migrations'
  }
})
export default db;
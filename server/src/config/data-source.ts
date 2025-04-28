import { DataSource } from 'typeorm';
import * as path from 'path';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname, '../**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '../migrations/**/*.{ts,js}')],
});
// For debugging
console.log('Entity path:', path.join(__dirname, '../**/*.entity.{ts,js}'));
console.log('Migration path:', path.join(__dirname, '../migrations/**/*.{ts,js}'));
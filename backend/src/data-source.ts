import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const entities = [
  process.env.NODE_ENV === 'production'
    ? path.join(__dirname, 'modules/**/entities/*.entity.js')
    : path.join(__dirname, 'modules/**/entities/*.entity.ts'),
];
const migrations = [
  process.env.NODE_ENV === 'production'
    ? path.join(__dirname, 'migrations/*.js')
    : path.join(__dirname, 'migrations/*.ts'),
];

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'ecommerce',
  password: process.env.DB_PASSWORD || 'ecommerce',
  database: process.env.DB_DATABASE || 'mini_ecommerce',
  entities,
  migrations,
  synchronize: false,
  logging: true,
});

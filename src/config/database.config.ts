import { registerAs } from '@nestjs/config';
import { join } from 'path';

const isTrue = (value: unknown) => value === 'true';
export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: isTrue(process.env.DB_SYNCHRONIZE),
  logging: isTrue(process.env.DB_LOGGING),
  autoLoadEntities: true,
  subscribers: [join(__dirname, '..', '**', '*.subscriber.{ts,js}')],
  maxQueryExecutionTime: 2000,
  extra: {
    poolSize: 20,
    connectionTimeoutMillis: 5000,
    query_timeout: 5000,
    statement_timeout: 5000,
  },
}));

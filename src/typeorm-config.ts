import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import common_connection_data from './typeorm-config.common';

const connection_data: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PSWD || 'postgres',
  database: process.env.DB_NAME || 'culturagastronomica',
};

export const TypeOrmConfig = [
  TypeOrmModule.forRoot({
    ...connection_data,
    ...common_connection_data,
  }),
];

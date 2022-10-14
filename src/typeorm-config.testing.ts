import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import common_connection_data from './typeorm-config.common';

const connection_data: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:',
  logging: false,
  dropSchema: true,
};

export const TypeOrmConfig = [
  TypeOrmModule.forRoot({
    ...connection_data,
    ...common_connection_data,
  }),
];

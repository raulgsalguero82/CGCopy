import { join } from 'path';

const common_connection_data = {
  autoLoadEntities: true,
  synchronize: true,
  keepConnectionAlive: true,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
};

export default common_connection_data;

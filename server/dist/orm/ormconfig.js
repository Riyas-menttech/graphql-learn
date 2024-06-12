import { DataSource } from 'typeorm';
import { User } from './entity/user-entity.js';
import { Product } from './entity/product-entity.js';
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'apple',
    password: 'mypassword',
    database: 'mydatabase',
    synchronize: true,
    logging: false,
    entities: [User, Product],
    migrations: [],
    subscribers: [],
});

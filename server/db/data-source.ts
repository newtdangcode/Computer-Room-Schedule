import { DataSourceOptions, DataSource } from "typeorm";
export const dataSourceOptions: DataSourceOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "computer-room-schedule",
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    migrationsTableName: "custom_migration_table",
    synchronize: false
}
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
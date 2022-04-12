import { DataSource } from 'typeorm';
import "reflect-metadata";

export class Mysql {
    private connection: DataSource;
    
    async connect() {
        const AppDataSource = new DataSource({
            "type": "mysql",
            "host": process.env.MYSQL_HOST,
            "port": parseInt(process.env.MYSQL_PORT),
            "username": process.env.MYSQL_USER,
            "password": process.env.MYSQL_PASS,
            "database": process.env.MYSQL_DB,
            "logging": false,
            "synchronize": true,
            "entities": [
                "dist/entity/**/*.{js,ts}",
            ],
        });

        return AppDataSource.initialize()
    }

    getConnection() {
        if (!this.connection) {
            console.error("Database connection is not initialized");
            throw new Error('Connection not initialized');
        }
        return this.connection;
    }

}
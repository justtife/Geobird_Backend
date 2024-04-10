import { DB } from "../../config";
import { Logger } from "../../logger";
import { config } from "../../config";
import mongoose from "mongoose";
class DatabaseManager {
    constructor() { }
    public async createDatabaseConnection(): Promise<void> {
        const maxRetries = 5;
        const retryDelay = 5000;
        let retries = 0;
        while (retries < maxRetries) {
            try {
                await DB({ ...config.DB });
                Logger.info('MongoDB Connected');
                return; // Connection succeeded, exit the function
            } catch (error) {
                Logger.error(`Unable to connect to the database\n${error}`);
                retries++;
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
            }
        }
        process.exit(1);
    }
    public async closeDatabaseConnection() {
        try {
            await mongoose.disconnect()
            Logger.info("Database connection closed.");
        } catch (error) {
            Logger.error(`Error closing database connection: \n${error}`);
            process.exit(1);
        }
    }
}
let DbManager = new DatabaseManager()
export default DbManager;

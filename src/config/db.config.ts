import mongoose, { Mongoose } from "mongoose";
import { DBInterface } from "../utils";
const mongoDB = async ({ uri, pool }: DBInterface): Promise<Mongoose> => {
    return await mongoose.connect(uri, pool,);
};
export {
    mongoDB as DB,
};

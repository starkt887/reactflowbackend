import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}/${DB_NAME}`)
        console.log(`\n Mongo DB Connected !!:\n${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("DB Connection error:", error);
        process.exit(1)
    }
}
export default connectDB
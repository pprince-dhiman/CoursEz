import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/LMS`);

    }
    catch (err) {
        console.log("Error in DB connection: ", err);
        throw new Error(err);
    }
}

export default connectDB;
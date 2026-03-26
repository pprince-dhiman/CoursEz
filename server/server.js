import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkWebhooks } from "./controller/webhooks.js";
import educatorRouter from "./routes/educatorRoute.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT;

// Middleware   
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get('/', (_, res) => { res.send("API is working"); });
app.post('/clerk-webhooks', clerkWebhooks);

app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);

// connections 
const initConnection = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB.");

        await connectCloudinary();
        console.log("Connected to Cloudinary.");

        app.listen(PORT, () => {
            console.log("Server running on", PORT);
        });

    } catch (err) {
        console.error("Startup failed:", err.message);
        process.exit(1);
    }
};

initConnection();
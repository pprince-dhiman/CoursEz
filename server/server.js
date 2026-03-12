import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkWebhooks } from "./controller/webhooks.js";
import educatorRouter from "./routes/educatorRoute.js";
import { clerkMiddleware } from "@clerk/express";

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

// connections 
const initConnection = () => {
    connectDB()
        .then(() => {
            console.log("Connect to DB");
            app.listen(PORT, () => {
                console.log("listening on ", PORT);
            });
        })
        .catch((err) => console.log(err));
}

initConnection();
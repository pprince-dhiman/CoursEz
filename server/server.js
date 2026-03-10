import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkWebhooks } from "./controller/webhooks.js";

const app = express();
const PORT = process.env.PORT;

// Middleware   
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_, res) => { res.send("API is working"); });
app.post('/clerk', clerkWebhooks);

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
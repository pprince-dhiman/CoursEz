import express from "express";
import "dotenv/config";
import cors from "cors";
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());

// Routes
app.get('/', (_, res) => {
    res.send("API is working");
});

app.listen(PORT, ()=> {
    console.log("listening on ", PORT);
});
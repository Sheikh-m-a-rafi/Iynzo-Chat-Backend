import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import { setServers } from "node:dns";
import { clerkMiddleware } from '@clerk/express'
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

// Configure DNS
setServers(["1.1.1.1", "1.0.0.1"]);

const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(cors())
app.use(express.json());
app.use(clerkMiddleware())

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);

// Error handler

app.use((err: any, _req: Request, res: Response, next: NextFunction)=> {

    console.error(err);
    res.status(500).json({ success: false, message: err?.message || "Something went wrong!" });

})


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
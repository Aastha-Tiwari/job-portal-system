import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/mongoose.config.js";
import jobRouter from "./routes/job.router.js";
import userRouter from "./routes/user.router.js";
import companyRouter from "./routes/company.router.js";
import applicationRouter from "./routes/application.router.js";

const app = express();

const PORT = process.env.PORT;

// connecting with database
connectDB();

app.use(express.json()); // to parse req.body in json
app.use(cors());

// API end points
app.use('/api/user',userRouter);
app.use('/api/company',companyRouter);
app.use('/api/job',jobRouter);
app.use('/api/application',applicationRouter);

app.get("/",(req , res)=>{
    res.send("API working");
});

app.listen(PORT , ()=>{
    console.log("Server is listening at PORT ", PORT);
})
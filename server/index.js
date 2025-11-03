import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/dbconnect.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import inventoryRoute from "./routes/inventory.route.js";
import clientRoute from "./routes/client.route.js"
import invoiceRoute from './routes/invoice.route.js'
import Activity from "./models/activities.model.js";
import generalRoute from "./routes/general.route.js"
const app = express();


// Configurations
dotenv.config();
const PORT = 5000 || process.env.PORT;

app.use(
  cors({
    origin: ["http://smart-billing-psi.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/authentication", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/inventory", inventoryRoute);
app.use("/api/client",clientRoute)
app.use('/api/invoice',invoiceRoute)
app.use('/api/general',generalRoute)
app.get('/api/activities/:companyId',async(req,res)=>{
  try {
    const {companyId}=req.params
    if(!companyId)
      res.status(400).json({success:false,message:"Missing Company ID"})
    const activities=await Activity.find({companyId})

    res.status(200).json({success:true,message:"Retrieved all activities",activities})
  } catch (error) {
    res.status(500).json({success:false,message:"Internal Server Error"})
  }
})



// Connection
await connectDB().then(() => {
  app.listen(PORT, () => console.log(`Listening to PORT: ${PORT}`));
});

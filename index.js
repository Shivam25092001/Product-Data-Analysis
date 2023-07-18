import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import salesRoutes from "./routes/sales.route.js";
import errhandle from "./middlewares/error.js";
dotenv.config();



const app = express();
app.use('/api', salesRoutes);
app.get('/', (req, res)=>{res.send("hello world")});
//Middleware for errors
app.use(errhandle);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, ()=>{
    console.log(`server up and running at: http://localhost:${PORT}`)
});


mongoose.connect(process.env.DB_CONNECT_URL)
  .then((data) => {
    console.log(`MongoDB connected with server: ${data.connection.host}`);
  })
  .catch((error) => {
    console.log(`Error: ${error.message}`);
    console.log(`Shutting down server due to unhandeled promise Rejection`);

    server.close(() => {
      process.exit(1);
    });
  })


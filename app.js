import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import blogRouter from "./routes/blogRouter.js";
import fileUpload from "express-fileupload";


const app = express();
dotenv.config({ path: "./config/config.env" });

// app.use(
//   cors({
//     origin:  "https://futurista-client.vercel.app",
//     methods: ["GET", "PUT", "DELETE", "POST"],
//     credentials: true,
//   })
// );

const allowedOrigins = [
  process.env.FRONTEND_URL, // Your frontend URL from environment variable
  "https://futurista-client.vercel.app", // Your production frontend URL
  "https://futurista-client-ijamon93i-satyaswarup129s-projects.vercel.app" ,
  "http://localhost:5173" // Temporary frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true, // Include credentials (cookies, tokens, etc.)
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

// Preflight OPTIONS request handling
app.options("*", cors());

// Your routes go here
// app.use("/api/v1", routes);


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);

dbConnection();

app.use(errorMiddleware);

export default app;

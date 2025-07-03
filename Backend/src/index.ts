import express from 'express'
import connectDB from './config/db'
import userRoutes from './routes/userRoutes'
import adminRoutes from './routes/adminRoutes'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

const Port = 3000

app.use(express.json())
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get('/', (req,res) => {
    res.send('task management backend is running')
})

app.use('/api', userRoutes)
app.use('/api/admin', adminRoutes)

const startServer = async () => {
  await connectDB();

  app.listen(Port, () => {
    console.log(`server is running on http://localhost:${Port}`);
  });
};

startServer();

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import categoryRoute from './routes/categoryRoute.js';
import Postroute from './routes/post.js';
dotenv.config();
const app = express();
const port = process.env.PORT;
//BodyParser Middleware --> to use req.body

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
  })
  .then(() => console.log('connexion reussie'))
  .catch((err) => {
    console.log('Impossible de se connecter à la base de données', err);
    process.exit();
  });
app.use(express.json({ limit: '20mb' }));
app.use(cors());

app.use('/api/categories', categoryRoute);
app.use('/api/posts', Postroute);


app.listen(port, () => console.log(`server running on port ${port}`));

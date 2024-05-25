import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import passport from 'passport';
import { connectToDb } from './config/db.js';
import { config, corsOptions } from './config/index.js';
import router from './routes/userRoutes.js';

// Connect to the database
(async () => {
  await connectToDb();
})();

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

//Load routes
app.use('/api/v1/user', router);

app.listen(config.port, () => {
  console.log(`Server is running on port http://localhost:${config.port}`);
});

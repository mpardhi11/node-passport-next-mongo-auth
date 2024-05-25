import dotenv from 'dotenv';
dotenv.config();

const _config = {
  port: process.env.PORT || 3000,
  frontEndUrl: process.env.FRONT_END_URL || 'http://localhost:3000',
  dbConnectionString: process.env.DB_CONNECTION_STRING,
  dbName: process.env.DB_NAME,
  mailService: {
    service: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
    sender: process.env.EMAIL_FROM,
  },
};
export const config = Object.freeze(_config);

export const corsOptions = {
  origin: config.frontEndUrl,
  optionsSuccessStatus: 200,
  credentials: true,
};

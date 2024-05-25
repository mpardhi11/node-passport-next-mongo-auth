import nodeMailer from 'nodemailer';
import { config } from './index.js';

const mailService = nodeMailer.createTransport({
  service: 'gmail',
  host: config.mailService.host,
  port: parseInt(config.mailService.port),
  secure: false,
  auth: {
    user: config.mailService.user,
    pass: config.mailService.pass,
  },
});

export default mailService;

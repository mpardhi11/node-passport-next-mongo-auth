import mailService from '../config/mailService.js';
import { HttpError } from '../helpers/utils.js';

// Function to send email
export const sendEmail = async (to, subject, text, html, from) => {
  try {
    const transporter = await mailService.sendMail({ from, to, subject, text, html });
    console.log(transporter);
    return true;
  } catch (error) {
    throw new HttpError('Failed to send verification link', 500);
  }
};

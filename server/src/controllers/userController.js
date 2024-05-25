import { config } from '../config/index.js';
import {
  generateOTP,
  generateOTPVerificationLink,
  hashPassword,
  HttpError,
  isAlreadyVerified,
  isPasswordValid,
  isUserVerified,
  isVerificationCodeValid,
  userNotFound,
  validate,
  validateEmailVerification,
  validateExistingUser,
  validateLoginBody,
} from '../helpers/utils.js';
import { sendEmail } from '../mailService/mailServiceHelper.js';
import emailVerification from '../models/emailVarification.js';
import { User } from '../models/userModel.js';
class UserController {
  // User registration
  static async userRegister(req, res) {
    try {
      const data = await validate(req.body);
      const { name, email, password } = data;

      const existingUser = await User.findOne({ email });
      await validateExistingUser(existingUser);

      const { hashedPassword, salt } = await hashPassword(password);

      const user = new User({ name, email, password: hashedPassword, passwordSalt: salt });
      await user.save();

      // Send email verification link
      await UserController.sendEmailVerificationLink(user.id, email);

      const response = { name: user.name, email: user.email, id: user._id };

      res.status(201).json({ status: 'success', message: 'User registered successfully', data: { response } });
    } catch (error) {
      res.status(error.statusCode ?? 500).json({ status: 'failed', error: error.message || 'Internal server error' });
    }
  }

  // User login
  static async userLogin(req, res) {
    try {
      const data = await validateLoginBody(req.body);
      const { email, password } = data;

      const user = await User.findOne({ email });
      userNotFound(user);
      isUserVerified(user);
      await isPasswordValid(password, user);

      res.status(200).json({ status: 'success', message: 'User logged in successfully' });
    } catch (error) {
      res.status(error.statusCode ?? 500).json({ status: 'failed', error: error.message || 'Internal server error' });
    }
  }

  // User logout

  // User email verification
  static async verifyEmail(req, res) {
    try {
      const reqData = await validateEmailVerification(req.body);
      const { email, otp } = reqData;

      const user = await User.findOne({ email });
      userNotFound(user);
      isAlreadyVerified(user);

      const userVerification = await emailVerification.findOne({ userId: user?.id, email, verificationCode: otp });
      isVerificationCodeValid(userVerification);

      await user.updateOne({ emailVerified: true });
      await emailVerification.deleteMany({ userId: user?.id, email });
      res.status(201).json({ status: 'success', message: 'Email verified successfully' });
    } catch (error) {
      res.status(error.statusCode ?? 500).json({ status: 'failed', error: error.message || 'Internal server error' });
    }
  }

  // User password reset

  // User password change

  // User profile update

  // User delete

  // Send email verification link

  static async sendEmailVerificationLink(userId, email) {
    try {
      const subject = 'Email Verification';
      const text = 'Email Verification';
      // Generate verification link
      const verificationLink = generateOTPVerificationLink();
      // Create OTP
      const verificationCode = generateOTP();
      const html = `<a href="${verificationLink}">Click here to verify your email</a>
      <p>Or copy and paste the following link in your browser: ${verificationLink}</p>
      <p> Your OTP is: ${verificationCode}</p>`;
      const from = config.mailService.sender;
      // Send email
      await sendEmail(email, subject, text, html, from);

      await emailVerification.create({ userId, email, verificationCode });
    } catch (error) {
      console.log(error);
      throw new HttpError('Failed to send verification link', 500);
    }
  }
}

export default UserController;

import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import joi from 'joi';
export const registerUserSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  passwordConformation: joi.string().min(8).required().valid(),
});

const verifyEmailSchema = joi.object({
  email: joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  otp: joi.number().min(1000).max(9999).required().messages({
    'number.base': 'OTP must be a number',
    'number.min': 'OTP must be a 4 digit number',
    'number.max': 'OTP must be a 4 digit number',
    'any.required': 'OTP is required',
  }),
});

const userLoginSchema = joi.object({
  email: joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  password: joi.string().min(8).required().messages({ 'any.required': 'Password is required' }),
});

export class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const validate = async (data) => {
  const { error, value } = await registerUserSchema.validate(data);
  if (error) {
    throw new HttpError(error.details[0].message, 400);
  }

  if (value.password !== value.passwordConformation) {
    throw new HttpError('Passwords and Password Conformation do not match', 400);
  }
  return value;
};

export const validateExistingUser = async (user) => {
  if (user) {
    throw new HttpError('User already exists', 400);
  }
};

export const generateRandomSalt = (length = 10) => {
  return bcrypt.genSaltSync(length);
};

export const hashPassword = async (password) => {
  const salt = generateRandomSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return { hashedPassword, salt };
};

// Generate a random 4 digit number for the OTP
export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

// Generate a otp verification link
export const generateOTPVerificationLink = () => {
  return `${config.frontEndUrl}/account/verify-email`;
};

export const validateEmailVerification = async (data) => {
  const { error, value } = await verifyEmailSchema.validate(data);
  if (error) {
    throw new HttpError(error.details[0].message, 400);
  }
  return value;
};

export function userNotFound(user) {
  if (!user) {
    throw new HttpError('User not found', 404);
  }
  return true;
}

export function isAlreadyVerified(user) {
  if (user.emailVerified) {
    throw new HttpError('User already verified', 400);
  }
  return true;
}

export function isVerificationCodeValid(emailVerification) {
  if (!emailVerification) {
    throw new HttpError('Invalid OTP', 400);
  }
  return true;
}

export function validateLoginBody(data) {
  const { error, value } = userLoginSchema.validate(data);
  if (error) {
    throw new HttpError(error.details[0].message, 400);
  }
  return value;
}

export function isUserVerified(user) {
  if (!user.emailVerified) {
    throw new HttpError('User not verified, please verify your email', 400);
  }
  return true;
}

export async function isPasswordValid(password, user) {
  // salt stored in the database
  const salt = user.passwordSalt;
  const hashedPasswordFromDb = user.password;
  // hash the password with the salt
  const hashedPassword = await bcrypt.hash(password, salt);
  // compare the hashed password with the password in the database
  if (hashedPassword !== hashedPasswordFromDb) throw new HttpError('Invalid password', 400);

  return true;
}

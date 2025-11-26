import { JWT_REFRESH_SECRET, JWT_SECRET } from "../contants/env";
import { CONFLICT, UNAUTHORIZED } from "../contants/http";
import VerificationCodeTypes from "../contants/verificationCodeTypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { oneYearFromNow } from "../utils/date";
import jwt from "jsonwebtoken";
import { refreshTokenSignOptions, signJwtToken } from "../utils/jwt";

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string | undefined;
};

export const createAccount = async (data: CreateAccountParams) => {
  //verify if user exists already
  const existingUser = await UserModel.exists({
    email: data.email,
  });
  appAssert(!existingUser, CONFLICT, "Email already in use");
  //create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });
  //create verification code
  const verficationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeTypes.EmailVerification,
    expiresAt: oneYearFromNow(),
  });
  //send verification code
  //create session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent,
  });
  //sign access token and refresh token
  const refreshToken = signJwtToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );

  const accessToken = signJwtToken({
    userId: user._id,
    sessionId: session._id,
  });
  //return user and tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

type LoginParams = {
  email: string;
  password: string;
  userAgent?: string | undefined;
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginParams) => {
  //get user by email and verify if they exists
  const user = await UserModel.findOne({ email: email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");
  //validate password
  const validPwd = await user.comparePassword(password);
  appAssert(validPwd, UNAUTHORIZED, "Invalid email or password");
  //create session
  const userId = user._id;
  const session = await SessionModel.create({
    userId,
    userAgent,
  });
  const sessionInfo = {
    sessionId: session._id,
  };
  //sign access and refresh tokens
  const refreshToken = signJwtToken(sessionInfo, refreshTokenSignOptions);
  const accessToken = signJwtToken({ userId, ...sessionInfo });
  //return user and tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

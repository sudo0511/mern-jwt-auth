import { JWT_REFRESH_SECRET, JWT_SECRET } from "../contants/env";
import { CONFLICT } from "../contants/http";
import VerificationCodeTypes from "../contants/verificationCodeTypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { oneYearFromNow } from "../utils/date";
import jwt from "jsonwebtoken";

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
  const refreshToken = jwt.sign(
    { sessionId: session._id },
    JWT_REFRESH_SECRET,
    { audience: ["user"], expiresIn: "30d" }
  );
  const accessToken = jwt.sign(
    { userId: user._id, sessionId: session._id },
    JWT_SECRET,
    {
      audience: ["user"],
      expiresIn: "15m",
    }
  );
  //return user and tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

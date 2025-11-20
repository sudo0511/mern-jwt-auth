import UserModel from "../models/user.model";

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  //verify if user exists already
  const existingUser = await UserModel.exists({
    email: data.email,
  });
  if (existingUser) {
    throw new Error("User already exists!");
  }
  //create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });
  //create verification code
  //send verification code
  //create session
  //sign access token and refresh token
  //return user and tokens
};

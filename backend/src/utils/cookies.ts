import { CookieOptions, Response } from "express";

const secure = process.env.NODE_ENV !== "development";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

type CookieParamTypes = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = ({
  res,
  accessToken,
  refreshToken,
}: CookieParamTypes) => {
  return res
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken);
};

import { CookieOptions, Response } from "express";
import { fifteenMinsFromNow, thirtyDaysFromNow } from "./date";

const secure = process.env.NODE_ENV !== "development";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinsFromNow(),
});
const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  path: "/auth/refresh", //better security -> as refresh only needs to be sent on this particular path
  //not on every request
});

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
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
};

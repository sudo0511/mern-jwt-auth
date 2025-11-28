import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../contants/env";
import { SessionDocument } from "../models/session.model";
import { UserDocument } from "../models/user.model";

export type RefreshTokenPayLoad = {
  sessionId: SessionDocument["_id"];
};
export type AccessTokenPayload = RefreshTokenPayLoad & {
  userId: UserDocument["_id"];
};
type OptionsAndSecret = SignOptions & {
  secret: string;
};
const defaults: SignOptions = {
  audience: ["user"],
};
export const accessTokenSignOptions: OptionsAndSecret = {
  expiresIn: "15m",
  secret: JWT_SECRET,
};
export const refreshTokenSignOptions: OptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};
export const signJwtToken = (
  payload: RefreshTokenPayLoad | AccessTokenPayload,
  options?: OptionsAndSecret
) => {
  const { secret, ...signOpt } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, { ...signOpt, ...defaults });
};

export const verifyToken = <TPayLoad extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret: string; audience?: string[] | string }
) => {
  const { secret = JWT_SECRET, ...verifyOpts } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      audience: ["user"],
      ...verifyOpts,
    }) as TPayLoad;
    return {
      payload,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

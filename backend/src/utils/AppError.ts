import AppErrorCode from "../contants/appErrorCodes";
import { HttpStatusCode } from "../contants/http";

class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);
  }
}

export default AppError;

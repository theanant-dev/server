import envConfig from "../config/env.config";

export class ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T | null;
  success: boolean;

  constructor(statusCode: number, message = "Success", data?: T) {
    if (envConfig.isNodeEnvDevelopment)
      console.log(
        `ApiResponse: ${statusCode}, message: ${message}, data: ${JSON.stringify(data)}`
      );

    this.statusCode = statusCode;
    this.message = message;
    this.data = typeof data === "undefined" ? null : data;
    this.success = statusCode < 400;
  }
}

type ApiErrorOptions = {
  statusCode: number;
  message?: string;
  errors?: any[];
  stack?: string;
};
export class ApiError extends Error {
  statusCode: number;
  data: null;
  success: boolean;
  errors: any[];

  constructor(
    { statusCode, message = "Something went wrong", errors = [], stack = "" }: ApiErrorOptions
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}


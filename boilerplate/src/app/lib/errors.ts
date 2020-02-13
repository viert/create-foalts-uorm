import { Config } from "@foal/core";

function apiException(target: any) {
  target.prototype.name = target.name;
}

@apiException
export class ApiError extends Error {
  protected readonly defaultMessage: string = "";
  code: number = 400;
  payload: { [key: string]: any } | null = null;

  constructor(
    msg?: string,
    statusCode?: number,
    payload?: { [key: string]: any }
  ) {
    super(msg);
    this.message = msg ? msg : this.defaultMessage;
    if (statusCode) {
      this.code = statusCode;
    }
    if (payload) {
      this.payload = payload;
    }
  }

  toObject(): { [key: string]: any } {
    let data: { [key: string]: any } = {
      error: this.message
    };
    if (this.payload) {
      data.data = this.payload;
    }
    return data;
  }
}

@apiException
export class AuthenticationError extends ApiError {
  code = 401;

  constructor(msg: string = "You must be authenticated first", ...args: any[]) {
    super(msg, ...args);
  }

  toObject(): { [key: string]: any } {
    let obj: { [key: string]: any } = {
      error: this.message,
      state: "logged out"
    };
    if (this.payload) {
      obj.data = this.payload;
    }
    return obj;
  }
}

@apiException
export class Forbidden extends ApiError {
  code = 403;
}

@apiException
export class BadGateway extends ApiError {
  code = 502;
}

@apiException
export class NotFound extends ApiError {
  code = 404;
}

@apiException
export class IntegrityError extends ApiError {
  code = 409;
}

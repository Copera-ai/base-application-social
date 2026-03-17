export enum HttpErrorCode {
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  INVALID = "INVALID",
  CONFLICT = "CONFLICT",
  UNPROCESSABLE = "UNPROCESSABLE",
}

type Info = {
  code: HttpErrorCode;
  [key: string]: any;
};

export class HTTPClientError extends Error {
  public statusCode: number;
  public info: Info;

  constructor(message: any, info: Info) {
    if (message instanceof Error) {
      super(message.message);
      this.stack = message.stack;
    } else {
      if (message instanceof Object) {
        super(JSON.stringify(message));
      } else {
        super(message);
      }
      (Error as any).captureStackTrace(this, this.constructor);
    }
    this.name = this.constructor.name;
    this.info = info;
  }
}

export class HTTP400Error extends HTTPClientError {
  constructor(message: string, info: Info) {
    super(message ?? "Bad Request", info);
    this.statusCode = 400;
  }
}

export class HTTP401Error extends HTTPClientError {
  constructor(message: string, info: Info) {
    super(message ?? "Unauthorized", info);
    this.statusCode = 401;
  }
}

export class HTTP403Error extends HTTPClientError {
  constructor(message: string, info: Info) {
    super(message ?? "Forbidden", info);
    this.statusCode = 403;
  }
}

export class HTTP404Error extends HTTPClientError {
  constructor(message: string, info: Info) {
    super(message ?? "Not Found", info);
    this.statusCode = 404;
  }
}

export class HTTP406Error extends HTTPClientError {
  constructor(message: string, info: Info) {
    super(message ?? "SyntaxError", info);
    this.statusCode = 406;
  }
}

export class HTTP409Error extends HTTPClientError {
  constructor(message: string, info: Info) {
    super(message ?? "Conflict", info);
    this.statusCode = 409;
  }
}

export class HTTP422Error extends HTTPClientError {
  constructor(message: string, info: Info) {
    super(message ?? "Unprocessable entity", info);
    this.statusCode = 422;
  }
}

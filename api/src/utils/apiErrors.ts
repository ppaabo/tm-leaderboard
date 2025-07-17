export class ApiError extends Error {
  status: number;
  originalError?: Error;
  constructor(message: string, status: number, originalError?: Error) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.originalError = originalError;
  }
  log() {
    console.error(`${this.name} error ${this.status}: ${this.message}`);
    if (this.originalError) {
      console.error("Original error:", this.originalError);
    }
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Not found", originalError?: Error) {
    super(message, 404, originalError);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = "Bad request", originalError?: Error) {
    super(message, 400, originalError);
    this.name = "BadRequestError";
  }
}

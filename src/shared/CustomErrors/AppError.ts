export class AppError extends Error {
    public statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  export class NotFoundException extends AppError {
    constructor(message: string) {
      super(message, 404);
    }
  }
  
  export class UnAuthorizedException extends AppError {
    constructor(message: string) {
      super(message, 401);
    }
  }
  
  export class BadRequestException extends AppError {
    constructor(message: string) {
      super(message, 400);
    }
  }
  
  export class InternalServerException extends AppError {
    constructor(message: string) {
      super(message, 500);
    }
  }
  
  export class ConflictException extends AppError {
    constructor(message: string) {
      super(message, 409);
    }
  }
  
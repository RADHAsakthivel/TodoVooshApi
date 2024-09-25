export class CustomResponse {
  message: string;
  status: number;
  data: any;
  constructor(_message: string, _status: number, _data: any = null) {
    this.message = _message;
    this.status = _status;
    this.data = _data;
  }
}

export class NotFoundResponse extends CustomResponse {
  constructor(message: string, data?: any) {
    super(message, 404, data);
  }
}

export class UnAuthorizedResponse extends CustomResponse {
  constructor(message: string, data?: any) {
    super(message, 401, data);
  }
}

export class ConflictResponse extends CustomResponse {
  constructor(message: string, data?: any) {
    super(message, 409, data);
  }
}

export class BadRequestResponse extends CustomResponse {
  constructor(message: string, data?: any) {
    super(message, 500, data);
  }
}

export class InternalServerResponse extends CustomResponse {
  constructor(message: string, data?: any) {
    super(message, 500, data);
  }
}

export class SucessResponse extends CustomResponse {
  constructor(message: string, data?: any) {
    super(message, 200, data);
  }
}

export class CreatedResponse extends CustomResponse {
  constructor(message: string, data: any) {
    super(message, 201, data);
  }
}

export class AcceptedResponse extends CustomResponse {
  constructor(message: string, data: any) {
    super(message, 202, data);
  }
}

export class NoContentResponse extends CustomResponse {
  constructor(message: string, data: any) {
    super(message, 204, data);
  }
}

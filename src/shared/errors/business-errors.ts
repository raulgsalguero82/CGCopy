export function BusinessLogicException(message: string, type: number) {
  this.message = message;
  this.type = type;
}

export enum BusinessError {
  NOT_FOUND = 404,
  PRECONDITION_FAILED = 412,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
}

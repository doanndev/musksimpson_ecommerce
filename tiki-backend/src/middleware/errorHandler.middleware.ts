import type { NextFunction, Request, Response } from 'express';

class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export interface ErrorWithErrors {
  errors?: Record<string, { properties: { message: string } }>;
}

const errorHandler = (
  error: HttpError | ErrorWithErrors | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let status = (error as HttpError).status || 500;
  let errors: string | Record<string, string> = (error as HttpError).message || 'Internal Server Error';

  if ((error as ErrorWithErrors).errors) {
    status = 400;
    errors = {};

    console.log({ error });
    for (const field in (error as ErrorWithErrors).errors) {
      const fieldError = (error as ErrorWithErrors).errors![field].properties.message;
      errors[field] = fieldError;
    }
  }

  if (typeof errors === 'string' && errors.includes(': ')) {
    const errorParts = errors.split(': ');
    errors = {
      [errorParts[0]]: errorParts[1],
    };
  }

  res.status(status).json({ message: 'Failed', data: errors });
};

export { errorHandler, HttpError };

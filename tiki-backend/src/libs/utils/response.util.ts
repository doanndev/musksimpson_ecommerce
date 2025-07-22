import type { Response } from 'express';
import { ZodError } from 'zod';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface Meta {
  page: number;
  limit: number;
  totalPage: number;
  totalItem: number;
}

interface ErrorResponse {
  errorData: unknown;
}

const handleError = (error: unknown, defaultMessage: string): ErrorResponse => {
  let errorData: unknown = null;

  if (error instanceof ZodError) {
    errorData = error.issues;
  } else if (error instanceof Error) {
    errorData = { message: error.message };
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorData = { message: (error as any).message };
  } else {
    errorData = { message: error || defaultMessage };
  }

  return { errorData };
};

const success = (res: Response, data: unknown = { status: 'ok', message: 'Success' }, message = 'Success') => {
  return res.status(200).json({
    message,
    data,
    statusCode: 200,
  });
};

const paginate = (res: Response, data: unknown[], meta: Meta, message = 'Success') => {
  return res.status(200).json({
    message,
    data: {
      items: data,
      meta,
    },
    statusCode: 200,
  });
};

const badRequest = (res: Response, error?: unknown, message = 'Bad request') => {
  const { errorData } = handleError(error, message);
  return res.status(400).json({
    error: message,
    data: errorData,
    statusCode: 400,
  });
};

const notFound = (res: Response, error?: unknown, message = 'Not found') => {
  const { errorData } = handleError(error, message);
  return res.status(404).json({
    error: message,
    data: errorData,
    statusCode: 404,
  });
};

const unauthorized = (res: Response, error?: unknown, message = 'Unauthorized') => {
  const { errorData } = handleError(error, message);
  return res.status(401).json({
    error: message,
    data: errorData,
    statusCode: 401,
  });
};

const forbidden = (res: Response, error?: unknown, message = 'Forbidden') => {
  const { errorData } = handleError(error, message);
  return res.status(403).json({
    error: message,
    data: errorData,
    statusCode: 403,
  });
};

const error = (res: Response, error?: unknown, message = 'Error') => {
  const { errorData } = handleError(error, message);
  return res.status(500).json({
    error: message,
    data: errorData,
    statusCode: 500,
  });
};

const manyRequest = (res: Response, error?: unknown, message = 'Too many requests') => {
  const { errorData } = handleError(error, message);
  return res.status(429).json({
    error: message,
    data: errorData,
    statusCode: 429,
  });
};

export const response = {
  success,
  paginate,
  badRequest,
  notFound,
  unauthorized,
  forbidden,
  error,
  manyRequest,
};

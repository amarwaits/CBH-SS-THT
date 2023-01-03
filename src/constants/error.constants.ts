/**
 * Client Failures
 */
export const UNKNOWN_ENDPOINT = {
  code: 'UNKNOWN_ENDPOINT',
  message: 'The requested endpoint does not exist.',
  statusCode: 404,
};

export const INVALID_REQUEST = {
  code: 'INVALID_REQUEST',
  message: 'The request has invalid parameters.',
  statusCode: 423,
};

/**
 * Server Errors
 */
export const INTERNAL_ERROR = {
  code: 'INTERNAL_ERROR',
  message: 'The server encountered an internal error.',
  statusCode: 500,
};

export const UNKNOWN_ERROR = {
  code: 'UNKNOWN_ERROR',
  message: 'The server encountered an unknown error.',
  statusCode: 500,
};

export const ERROR_MESSAGES = {
  INVALID_AUTH_TOKEN: 'Could not verify request, Invalid or Missing Auth Token',
};

/**
 * Error factory utilities for creating consistent API errors in tests.
 */

/**
 * Creates an Error with an attached status code, matching the pattern used by API errors.
 *
 * @param message - The error message
 * @param status - Optional HTTP status code
 * @returns An Error with optional status property
 */
export function createApiError(message: string, status?: number): Error {
  const error = new Error(message);
  if (status !== undefined) {
    (error as Error & { status?: number }).status = status;
  }
  return error;
}

/**
 * Standard error scenarios for common API error cases.
 * Use these for consistent error testing across all tools.
 */
export const standardErrors = {
  unauthorized: () => createApiError('Unauthorized', 401),
  forbidden: () => createApiError('Forbidden', 403),
  notFound: (entity: string) => createApiError(`${entity} not found`, 404),
  badRequest: (message = 'Bad request') => createApiError(message, 400),
  serverError: () => createApiError('Internal Server Error', 500),
  networkError: () => new Error('Network error'),
  timeout: () => new Error('Request timeout'),
};

/**
 * Type for Error with optional status property
 */
export type ApiError = Error & { status?: number };

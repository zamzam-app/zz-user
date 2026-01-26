type ErrorLike = Error | { message: string };

export const isError = (error: unknown): error is ErrorLike => {
  if (error instanceof Error) {
    return true;
  }

  return (
    error != null &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
};

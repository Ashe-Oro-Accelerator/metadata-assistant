import { dictionary } from '@/libs/en';

export const formatErrorMessage = (error: unknown): string => {
  const errorMessage = error instanceof Error ? error.message : dictionary.errors.unknownError;
  return errorMessage;
};

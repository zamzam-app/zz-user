import type { FormData, FormOption } from '@/types/form';
import { withoutToken } from './axios.config';
import { formEndpoints } from './endpoints';

const toOptionText = (option: unknown): string | null => {
  if (typeof option === 'string') return option;
  if (
    option &&
    typeof option === 'object' &&
    'text' in option &&
    typeof (option as { text?: unknown }).text === 'string'
  ) {
    return (option as { text: string }).text;
  }
  return null;
};

const normalizeQuestionOptions = (
  options: unknown
): FormOption[] | undefined => {
  if (!Array.isArray(options)) return undefined;
  return options
    .map(toOptionText)
    .filter((text): text is string => text !== null)
    .map((text) => ({ text }));
};

export const normalizeFormResponse = (formData: FormData): FormData => ({
  ...formData,
  questions: formData.questions.map((question) => ({
    ...question,
    options: normalizeQuestionOptions(
      (question as { options?: unknown }).options
    ),
  })),
});

export const formApi = {
  getFormById: async (id: string): Promise<FormData> => {
    const response = await withoutToken<FormData>({
      method: 'GET',
      url: formEndpoints.getById(id),
    });
    return normalizeFormResponse(response);
  },
};

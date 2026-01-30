import { useState, useCallback, ChangeEvent } from 'react';
import { ZodSchema, ZodError } from 'zod';

/**
 * Configuration options for the useFormState hook.
 * @typeParam T - Form data type (must extend Record<string, unknown>)
 * @category Hooks
 */
interface UseFormStateOptions<T extends Record<string, unknown>> {
  /** Initial values for all form fields */
  initialValues: T;
  /** Optional Zod schema for form validation */
  validationSchema?: ZodSchema<T>;
  /** Async function called on valid form submission */
  onSubmit: (data: T) => Promise<void>;
}

/**
 * Return type of the useFormState hook.
 * @typeParam T - Form data type
 * @category Hooks
 */
interface UseFormStateReturn<T extends Record<string, unknown>> {
  /** Current form field values */
  formData: T;
  /** Validation errors by field name */
  errors: Partial<Record<keyof T, string>>;
  /** True while onSubmit is executing */
  isSubmitting: boolean;
  /** Handler for input change events */
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  /** Form submission handler (validates then calls onSubmit) */
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  /** Programmatically set a field value */
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  /** Programmatically set a field error */
  setFieldError: (field: keyof T, error: string) => void;
  /** Reset form to initial values and clear errors */
  resetForm: () => void;
  /** Clear all validation errors */
  clearErrors: () => void;
}

/**
 * Generic form state management hook with Zod validation.
 *
 * Provides complete form state management including:
 * - **Field state**: Track values and changes
 * - **Validation**: Zod schema integration with field-level errors
 * - **Submission**: Async submit with loading state
 * - **Error clearing**: Auto-clear errors on field change
 *
 * @typeParam T - Form data type (must extend Record<string, unknown>)
 * @param options - Configuration including initial values, validation, and submit handler
 * @returns Form state and control functions
 *
 * @example
 * Basic usage with validation:
 * ```tsx
 * function LoginForm() {
 *   const { formData, errors, isSubmitting, handleChange, handleSubmit } = useFormState({
 *     initialValues: { email: '', password: '' },
 *     validationSchema: loginSchema,
 *     onSubmit: async (data) => {
 *       await api.login(data);
 *       router.push('/dashboard');
 *     }
 *   });
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <Input name="email" value={formData.email} onChange={handleChange} error={errors.email} />
 *       <Input name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
 *       <Button type="submit" disabled={isSubmitting}>Connexion</Button>
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * Programmatic field manipulation:
 * ```tsx
 * const { setFieldValue, setFieldError, resetForm } = useFormState({ ... });
 *
 * // Set value programmatically
 * setFieldValue('email', 'prefilled@example.com');
 *
 * // Set custom error
 * setFieldError('email', 'Cet email est déjà utilisé');
 *
 * // Reset entire form
 * resetForm();
 * ```
 *
 * @category Hooks
 */
export function useFormState<T extends Record<string, unknown>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormStateOptions<T>): UseFormStateReturn<T> {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value, type } = e.target;
      const newValue =
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

      setFormData((prev) => ({ ...prev, [name]: newValue }));

      // Clear error when field is modified
      if (errors[name as keyof T]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name as keyof T];
          return newErrors;
        });
      }
    },
    [errors],
  );

  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
  }, [initialValues]);

  const validate = useCallback((): boolean => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof T, string>> = {};
        for (const issue of error.issues) {
          const fieldName = issue.path[0] as keyof T;
          if (!fieldErrors[fieldName]) {
            fieldErrors[fieldName] = issue.message;
          }
        }
        setErrors(fieldErrors);
      }
      return false;
    }
  }, [formData, validationSchema]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validate()) return;

      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onSubmit, validate],
  );

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    clearErrors,
  };
}

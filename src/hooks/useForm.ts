import { useState, useCallback } from "react";

interface FormValues {
  [key: string]: string | boolean;
}

export const useForm = (
  initialValues: FormValues,
  onSubmit?: (values: FormValues) => void,
) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit?.(values);
    },
    [values, onSubmit],
  );

  const setFieldValue = useCallback((name: string, value: string | boolean) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
  };
};

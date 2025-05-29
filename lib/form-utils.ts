import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { ApiError } from "@/types/global";

export function setFormValidationErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  error: ApiError
) {
  const validationErrors = error.errors as Record<string, string[]>;

  if (validationErrors) {
    Object.entries(validationErrors).forEach(([field, messages]) => {
      form.setError(field as Path<T>, {
        type: "server",
        message: messages[0],
      });
    });
  }
}

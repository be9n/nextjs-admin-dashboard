import { z } from "zod";
import { routing } from "@/i18n/routing";
import { useTranslations } from "next-intl";

/**
 * Create the category form schema with dynamic fields for all supported locales
 */
export function useCategoryFormSchema(isUpdating = false) {
  const tGlobalForm = useTranslations("global.from");
  const tCategoriesForm = useTranslations("categories.form");
  const tGlobal = useTranslations("global");

  // Create a dynamic name schema object first
  const nameFields: Record<string, z.ZodString> = {};

  // Add validation for each locale
  routing.locales.forEach((locale) => {
    nameFields[locale] = z.string().min(1, {
      message: tGlobalForm("translatedNameRequired", {
        locale: tGlobal(locale),
      }),
    });
  });

  // Then create the complete schema
  return z.object({
    name: z.object(nameFields),
    parent_id: z
      .number()
      .min(1, { message: tCategoriesForm("parentCategoryRequired") }),
    image: isUpdating
      ? z.instanceof(File).optional()
      : z.instanceof(File, {
          message: tGlobalForm("imageRequired"),
        }),
  });
}

/**
 * Type definition for form values
 */
export type CategoryFormValues = z.infer<
  ReturnType<typeof useCategoryFormSchema>
>;

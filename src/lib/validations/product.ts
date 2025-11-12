import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { VALIDATION_MESSAGES } from "@/lib/constants";
import { formatString } from "@/lib/utils";

const ProductParams = z.object({
    name: z
        .string({ error: formatString(VALIDATION_MESSAGES.Required, "Business Name") }),
    sku: z.string({
        error: formatString(VALIDATION_MESSAGES.Required, "Business Type"),
    }),
    category: z.string({
        error: formatString(VALIDATION_MESSAGES.Required, "Business Type"),
    }),
    unitPrice: z.number({
        error: formatString(VALIDATION_MESSAGES.Required, "Business Type"),
    }),
    costPrice: z.number({
        error: formatString(VALIDATION_MESSAGES.Required, "Business Type"),
    }),
    stock: z.number({
        error: formatString(VALIDATION_MESSAGES.Required, "Business Type"),
    }),
    lowStockThreshold: z.number({
        error: formatString(VALIDATION_MESSAGES.Required, "Business Type"),
    }),
    supplier: z.string().optional(),
});

export const ProductParamsSchema = toFormikValidationSchema(ProductParams);
export type ProductParamsType = z.infer<typeof ProductParams>;
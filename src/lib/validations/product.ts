import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { VALIDATION_MESSAGES } from "@/lib/constants";
import { formatString } from "@/lib/utils";

const ProductParams = z.object({
    name: z
        .string({ error: formatString(VALIDATION_MESSAGES.Required, "Name") }),
    sku: z.string({
        error: formatString(VALIDATION_MESSAGES.Required, "SKU"),
    }),
    category: z.string({
        error: formatString(VALIDATION_MESSAGES.Required, "Category"),
    }),
    unitPrice: z.number({
        error: formatString(VALIDATION_MESSAGES.Required, "Unit price"),
    }),
    costPrice: z.number({
        error: formatString(VALIDATION_MESSAGES.Required, "Cost Price"),
    }),
    discountPrice: z.number({
        error: formatString(VALIDATION_MESSAGES.Required, "Discount Price"),
    }).optional(),
    stock: z.number({
        error: formatString(VALIDATION_MESSAGES.Required, "Stock"),
    }).min(0),
    lowStockThreshold: z.number({
        error: formatString(VALIDATION_MESSAGES.Required, "Low Stock Threshold"),
    }).min(0),
    supplier: z.string().optional(),
});

export const ProductParamsSchema = toFormikValidationSchema(ProductParams);
export type ProductParamsType = z.infer<typeof ProductParams>;
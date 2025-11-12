import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { VALIDATION_MESSAGES } from "@/lib/constants";
import { formatString } from "@/lib/utils";

const SaleParams = z.object({
    productId: z
        .string({ error: formatString(VALIDATION_MESSAGES.Required, "Business Name") }),
    customerId: z
        .string({ error: formatString(VALIDATION_MESSAGES.Required, "Business Name") }).optional(),
    quantity: z
        .number({ error: formatString(VALIDATION_MESSAGES.Required, "Business Name") }),
    paymentMethod: z.string({
        error: formatString(VALIDATION_MESSAGES.Required, "Business Type"),
    }),
    unitPrice: z.number({
        error: formatString(VALIDATION_MESSAGES.Required, "Business Type"),
    }),
    notes: z.string().optional(),
});

export const SaleParamsSchema = toFormikValidationSchema(SaleParams);
export type SaleParamsType = z.infer<typeof SaleParams>;
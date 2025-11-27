import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { VALIDATION_MESSAGES } from "@/lib/constants";
import { formatString } from "@/lib/utils";

const SaleParams = z.object({
    productId: z
        .string({ error: formatString(VALIDATION_MESSAGES.Required, "Product ID") }),
    customerId: z
        .string({ error: formatString(VALIDATION_MESSAGES.Required, "Customer ID") }).optional(),
    quantity: z
        .number({ error: formatString(VALIDATION_MESSAGES.Required, "Quantity") }),
    paymentMethod: z.string({
        error: formatString(VALIDATION_MESSAGES.Required, "Payment Method"),
    }),
    unitPrice: z.number({
        error: formatString(VALIDATION_MESSAGES.Required, "Unit Price"),
    }),
    notes: z.string().optional(),
});

export const SaleParamsSchema = toFormikValidationSchema(SaleParams);
export type SaleParamsType = z.infer<typeof SaleParams>;
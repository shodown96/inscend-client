import { VALIDATION_MESSAGES } from "@/lib/constants";
import { formatString } from "@/lib/utils";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const CustomerParams = z.object({
    name: z
        .string({ error: formatString(VALIDATION_MESSAGES.Required, "Name") }),
    email: z
        .string({ error: formatString(VALIDATION_MESSAGES.Required, "Email") }),
    phone: z
        .string({ error: formatString(VALIDATION_MESSAGES.Required, "Phone number") }),
    location: z
        .string({ error: formatString(VALIDATION_MESSAGES.Required, "Location") }),
    notes: z.string().optional(),
});

export const CustomerParamsSchema = toFormikValidationSchema(CustomerParams);
export type CustomerParamsType = z.infer<typeof CustomerParams>;
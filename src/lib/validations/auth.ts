import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { VALIDATION_MESSAGES } from "@/lib/constants";
import { formatString } from "@/lib/utils";

const SignInParams = z.object({
    email: z
        .string({ error: formatString(VALIDATION_MESSAGES.Required, "Email") })
        .email({ message: VALIDATION_MESSAGES.EmailInvalid }),
    password: z.string({
        error: formatString(VALIDATION_MESSAGES.Required, "Password"),
    }),
});

export const SignInParamsSchema = toFormikValidationSchema(SignInParams);
export type SignInParamsType = z.infer<typeof SignInParams>;


const SignUpParams = z.object({
    name: z.string({
        error: formatString(VALIDATION_MESSAGES.Required, "Name"),
    }).optional(),
    email: z
        .string({ error: formatString(VALIDATION_MESSAGES.Required, "Email") })
        .email({ message: VALIDATION_MESSAGES.EmailInvalid }),
    password: z.string({
        error: formatString(VALIDATION_MESSAGES.Required, "Password"),
    }),
    confirmPassword: z.string({
        error: formatString(VALIDATION_MESSAGES.Required, "Confirm Password"),
    }),
})
    .refine((values) => values.password === values.confirmPassword, {
        message: VALIDATION_MESSAGES.PasswordMismatch,
        path: ["confirmPassword"],
    });

export const SignUpParamsSchema = toFormikValidationSchema(SignUpParams);
export type SignUpParamsType = z.infer<typeof SignUpParams>;


const SetupBusinessParams = z.object({
    name: z
        .string({ error: formatString(VALIDATION_MESSAGES.Required, "Business Name") }),
    type: z.string({
        error: formatString(VALIDATION_MESSAGES.Required, "Business Type"),
    }),
});

export const SetupBusinessParamsSchema = toFormikValidationSchema(SetupBusinessParams);
export type SetupBusinessParamsType = z.infer<typeof SetupBusinessParams>;

const EmailParams = z.object({
    email: z
        .string({ error: formatString(VALIDATION_MESSAGES.Required, "Email") })
        .email({ message: VALIDATION_MESSAGES.EmailInvalid }),
});

export const EmailParamsSchema = toFormikValidationSchema(EmailParams);
export type EmailParamsType = z.infer<typeof EmailParams>;

const CodeParams = z.object({
    code: z.string({ error: formatString(VALIDATION_MESSAGES.Required, "Code") }).min(6),
});

export const CodeParamsSchema = toFormikValidationSchema(CodeParams);
export type CodeParamsType = z.infer<typeof CodeParams>;

const ResetPasswordParams = z.object({
    confirmPassword: z.string({
        error: formatString(VALIDATION_MESSAGES.Required, "Confirm Password"),
    }),
    newPassword: z.string({
        error: formatString(VALIDATION_MESSAGES.Required, "Password"),
    }),
})
    .refine((values) => values.newPassword === values.confirmPassword, {
        message: VALIDATION_MESSAGES.PasswordMismatch,
        path: ["confirmPassword"],
    });

export const ResetPasswordParamsSchema =
    toFormikValidationSchema(ResetPasswordParams);
export type ResetPasswordParamsType = z.infer<typeof ResetPasswordParams>;

const NewPasswordParams = z.object({
    confirmPassword: z.string({
        error: formatString(VALIDATION_MESSAGES.Required, "Confirm Password"),
    }),
    newPassword: z.string({
        error: formatString(VALIDATION_MESSAGES.Required, "Password"),
    }),
})
    .refine((values) => values.newPassword === values.confirmPassword, {
        message: VALIDATION_MESSAGES.PasswordMismatch,
        path: ["confirmPassword"],
    });

export const NewPasswordParamsSchema =
    toFormikValidationSchema(NewPasswordParams);
export type NewPasswordParamsType = z.infer<typeof NewPasswordParams>;

const ProfileParams = z.object({
    name: z.string({
        error: formatString(VALIDATION_MESSAGES.Required, "Name"),
    }).optional(),
    email: z
        .string({ error: formatString(VALIDATION_MESSAGES.Required, "Email") }),
    business: z.object({
        name: z
            .string({ error: formatString(VALIDATION_MESSAGES.Required, "Business Name") }),
        type: z.string({
            error: formatString(VALIDATION_MESSAGES.Required, "Business Type"),
        }),
    })

})

export const ProfileParamsSchema = toFormikValidationSchema(ProfileParams);
export type ProfileParamsType = z.infer<typeof ProfileParams>;



export type ResetPasswordParams = Partial<EmailParamsType> & Partial<CodeParamsType> & Partial<NewPasswordParamsType>
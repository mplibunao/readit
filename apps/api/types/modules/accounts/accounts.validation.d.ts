import { z } from 'zod';
export declare const password: z.ZodEffects<z.ZodString, string, string>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodEffects<z.ZodString, string, string>;
    firstName: z.ZodString;
    lastName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    firstName: string;
    lastName: string;
}, {
    password: string;
    email: string;
    firstName: string;
    lastName: string;
}>;
export declare type RegisterSchema = z.infer<typeof registerSchema>;
export declare const userByIdInput: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare type UserByIdInput = z.infer<typeof userByIdInput>;
//# sourceMappingURL=accounts.validation.d.ts.map
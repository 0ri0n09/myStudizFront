import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export function useEditPasswordSchema() {
    return toTypedSchema(
        z.object({
            password_old: z
                .string({ required_error: "Le mot de passe est requis" })
                .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
                .trim(),
            password: z
                .string({ required_error: "Le mot de passe est requis" })
                .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
                .trim(),

            password_confirmation: z
                .string({ required_error: "La confirmation du mot de passe est requise" })
                .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
                .trim(),
        })
        .refine((data) => data.password === data.password_confirmation, {
            path: ["password_confirmation"],
            message: "Les mots de passe ne correspondent pas",
        })
    )
}

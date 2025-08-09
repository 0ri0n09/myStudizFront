import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useI18n } from "vue-i18n";
import { computed } from 'vue';

export function useLoginSchema() {
    const { t, te } = useI18n();

    return computed(() => {
        return toTypedSchema(
            z.object({
                email: z.string({
                    required_error: te('loginSchema.email_required')
                        ? t('loginSchema.email_required')
                        : "L'adresse email est requise"
                }).email({
                    message: te('loginSchema.email_invalid')
                        ? t('loginSchema.email_invalid')
                        : "L'adresse email n'est pas valide"
                }).trim(),
                password: z
                    .string()
                    .min(8, {
                        message: te('loginSchema.password_min')
                            ? t('loginSchema.password_min')
                            : "Le mot de passe doit contenir au moins 8 caractères"
                    })
                    .trim(),
                remember: z.boolean().default(false),
            })
        );
    });
}
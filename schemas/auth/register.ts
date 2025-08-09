import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

export function useRegisterSchema() {
    const { t, te } = useI18n();

    return computed(() => {
        return toTypedSchema(
            z.object({
                username: z.string({
                    required_error: te('registerSchema.username_required')
                        ? t('registerSchema.username_required')
                        : "Le nom d'utilisateur est requis"
                }).min(3, {
                    message: te('registerSchema.username_length')
                        ? t('registerSchema.username_length')
                        : "Le nom d'utilisateur est trop court"
                }).trim(),
                email: z.string({
                    required_error: te('registerSchema.email_required')
                        ? t('registerSchema.email_required')
                        : "L'adresse email est requise"
                }).email({
                    message: te('registerSchema.email_invalid')
                        ? t('registerSchema.email_invalid')
                        : "L'adresse email n'est pas valide"
                }).trim(),
                password: z
                    .string({
                        required_error: te('registerSchema.password_required')
                            ? t('registerSchema.password_required')
                            : "Le mot de passe est requis"
                    })
                    .min(8, {
                        message: te('registerSchema.password_min')
                            ? t('registerSchema.password_min')
                            : "Le mot de passe doit contenir au moins 8 caractères"
                    })
                    .trim(),
                password_confirmation: z
                    .string({
                        required_error: te('registerSchema.password_confirmation_required')
                            ? t('registerSchema.password_confirmation_required')
                            : "La confirmation du mot de passe est requise"
                    })
                    .min(8, {
                        message: te('registerSchema.password_min')
                            ? t('registerSchema.password_min')
                            : "Le mot de passe doit contenir au moins 8 caractères"
                    })
                    .trim(),
                gender: z.string({
                    required_error: te('registerSchema.gender_required')
                        ? t('registerSchema.gender_required')
                        : "Le genre est requis"
                }).min(1, {
                    message: te('registerSchema.gender_required')
                        ? t('registerSchema.gender_required')
                        : "Le genre est requis"
                }).trim(),
                country: z.string({
                    required_error: te('registerSchema.country_required')
                        ? t('registerSchema.country_required')
                        : "Le pays est requis"
                }).min(1, {
                    message: te('registerSchema.country_required')
                        ? t('registerSchema.country_required')
                        : "Le pays est requis"
                }),
            }).refine((data) => data.password === data.password_confirmation, {
                message: te('registerSchema.passwords_do_not_match')
                    ? t('registerSchema.passwords_do_not_match')
                    : "Les mots de passe ne correspondent pas",
                path: ["password_confirmation"],
            })
        );
    });
}
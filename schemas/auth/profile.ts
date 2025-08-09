import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

export function useProfileSchema() {
    //const { t, te } = useI18n();

    return computed(() => {
        return toTypedSchema(
            z.object({
                username: z.string({
                    required_error: "Le nom d'utilisateur est requis"
                }).min(3, {
                    message: "Le nom d'utilisateur est trop court"
                }).trim(),
                gender: z.string({
                    required_error: "Le genre est requis"
                }).min(1, {
                    message: "Le genre est requis"
                }).trim(),
                country: z.string({
                    required_error: "Le pays est requis"
                }).min(1, {
                    message: "Le pays est requis"
                }),
            })
        )
    })
}
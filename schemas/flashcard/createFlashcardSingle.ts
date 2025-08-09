import { z } from 'zod'
//import { useI18n } from 'vue-i18n';
import { FlashcardType } from "~/types/flashcard";

export function useCreateFlashcardSingleSchema() {
    //const { t, te } = useI18n();

    return computed(() => {
        return toTypedSchema(
            z.object({
                ownerId: z
                    .string({
                        required_error: "L'ID du propriétaire est requis",
                    })
                    .uuid("ID du propriétaire invalide"),
                folderId: z
                    .string({
                        required_error: "L'ID du dossier est requis",
                    })
                    .uuid("ID du dossier invalide"),
                tip: z
                    .string()
                    .optional(),
                note: z
                    .string()
                    .optional(),
                type: z
                    .literal(FlashcardType.SINGLE),
                question: z
                    .string({
                        required_error: "Une question est requise",
                    })
                    .min(1, "La question doit contenir au moins 1 caractère"),
                answers: z
                    .object({})
                    .optional(),
            }),
        );
    });
}

import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { FlashcardType } from '~/types/flashcard'

const baseSchema = z.object({
    ownerId: z.string({
        required_error: "L'ID du propriétaire est requis"
    }).uuid("ID du propriétaire invalide"),

    folderId: z.string({
        required_error: "L'ID du dossier est requis"
    }).uuid("ID du dossier invalide"),

    type: z.nativeEnum(FlashcardType, {
        required_error: "Le type de flashcard est requis"
    }),

    question: z.string({
        required_error: "Une question est requise"
    }).min(1, "La question doit contenir au moins 1 caractère"),

    tip: z.string().optional(),
    note: z.string().optional()
})

const singleAnswerSchema = baseSchema.extend({
    type: z.literal(FlashcardType.SINGLE),
    answers: z.object({
        answer: z.string({
            required_error: "La réponse est requise"
        }).min(1, "La réponse ne peut pas être vide")
    })
})

const multipleAnswerSchema = baseSchema.extend({
    type: z.literal(FlashcardType.MULTIPLE),
    answers: z.object({
        options: z.array(
            z.object({
                answer: z.string().min(1, "L'option ne peut pas être vide"),
                isCorrect: z.boolean()
            })
        )
            .min(2, "Au moins deux options sont requises")
            .refine((options) => options.some(o => o.isCorrect), {
                message: "Au moins une option correcte est requise"
            })
    })
})

// Schéma final : liste de flashcards avec validation discriminée
const flashcardArraySchema = z.array(
    z.discriminatedUnion('type', [singleAnswerSchema, multipleAnswerSchema])
)

export function useCreateFlashcardsSchema() {
    return computed(() => toTypedSchema(flashcardArraySchema))
}

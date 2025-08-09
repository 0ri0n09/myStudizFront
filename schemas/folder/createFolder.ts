import { z } from "zod";
import { useI18n } from 'vue-i18n';

export function useCreateFolderSchema() {
    const { t, te } = useI18n();

    return computed(() => {
        return toTypedSchema(
            z.object({
                name: z.string({
                    required_error: te('createFolderSchema.name_required')
                        ? t('createFolderSchema.name_required')
                        : "Un nom de dossier est requis"
                }).min(1, t('createFolderSchema.name_length')),
                color: z.string({
                    required_error: te('createFolderSchema.color_required')
                        ? t('createFolderSchema.color_required')
                        : "Une couleur est requise"
                }),
                isPublic: z.string( {
                    required_error: te('createFolderSchema.isPublic_required')
                        ? t('createFolderSchema.isPublic_required')
                        : "Visibilité requise"
                }),
            }),
        );
    });
}
import { toast } from "~/components/ui/toast";
import type { UUID } from "node:crypto";
import { type Flashcard, FlashcardType } from "~/types/flashcard";
import type {Folder} from "~/types/folder";

export function useFlashcard() {

    async function showAll(folderId: UUID) {
        const response = await useApiFetch(('flashcard/'+folderId), {
            method: "GET"
        });

        if (response.error.value) {
            const errorData = response.error.value;
            if (errorData) {
                toast({
                    title: "Error",
                    description: errorData.message,
                    variant: "destructive",
                });
            }
            return response;
        }
        return response;
    }

    async function create(flashcardsData: Flashcard[]) {
        const response = await useApiFetch("flashcard", {
            method: "POST",
            body: {
                flashcards: flashcardsData,
            },
        });
        if (response.error.value) {
            const errorData = response.error.value;
            if (errorData.statusCode === 400) {
                toast({
                    title: "Error",
                    description: errorData.message,
                    variant: "destructive",
                });
            }
            return response;
        }
        toast({
            title: "Flashcards créés !",
            description: "",
            variant: "success",
        });
        return response;
    }

    async function edit(flashcardData: Flashcard) {
        const response = await useApiFetch(`flashcard/${flashcardData.id}`, {
            method: "PATCH",
            body: flashcardData,
        });
        if (response.error.value) {
            const errorData = response.error.value;
            if (errorData) {
                toast({
                    title: "Error",
                    description: errorData.message,
                    variant: "destructive",
                });
            }
            return response;
        }
        toast({
            title: "Flashcard modifiée !",
            description: "",
            variant: "success",
        });
        return response;
    }

    async function remove(flashcardId: UUID) {
        const response = await useApiFetch(`flashcard/${flashcardId}`, {
            method: "DELETE",
        });
        if (response.error.value) {
            const errorData = response.error.value;
            if (errorData) {
                toast({
                    title: "Error",
                    description: errorData.message,
                    variant: "destructive",
                });
            }
            return response;
        }
        toast({
            title: "Flashcard supprimée !",
            description: "",
            variant: "success",
        });
        return response;
    }

    return {
        showAll, create, edit, remove
    };
}
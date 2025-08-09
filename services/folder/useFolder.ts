import { toast } from "~/components/ui/toast";
import type { Folder } from "~/types/folder";
import type { UUID } from "node:crypto";

export function useFolder() {
    async function create(folderData: Folder) {
        const response = await useApiFetch("folder", {
            method: "POST",
            body: folderData,
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
            title: "Dossier créé !",
            description: "",
            variant: "success",
        });
        return response;
    }

    async function edit(folderData: Folder) {
        const response = await useApiFetch(`folder/${folderData.id}`, {
            method: "PATCH",
            body: folderData,
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
            title: "Dossier modifié !",
            description: "",
            variant: "success",
        });
        return response;
    }

    async function remove(folderId: UUID) {
        const response = await useApiFetch(`folder/${folderId}`, {
            method: "DELETE",
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
            title: "Dossier supprimé !",
            description: "",
            variant: "success",
        });
        return response;
    }

    async function showAll() {
        const response = await useApiFetch("folder");
        if (response.error.value) {
            console.log("Erreur lors de la récupération des dossiers: ", response.error.value);
            return response;
        }
        return response;
    }

    async function showAllOptions() {
        const response = await useApiFetch("folder/options");
        if (response.error.value) {
            console.log("Erreur lors de la récupération des options: ", response.error.value);
            return response;
        }
        return response;
    }

    async function show(folderId: UUID) {
        const response = await useApiFetch(`folder/${folderId}`);
        if (response.error.value) {
            console.log("Erreur lors de la récupération du dossier: ", response.error.value);
            return response;
        }
        return response;
    }

    return {
        create,
        edit,
        remove,
        showAll,
        showAllOptions,
        show,
    };
}
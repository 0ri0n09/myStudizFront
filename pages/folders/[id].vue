<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { UUID } from "node:crypto";
import type { Folder } from "~/types/folder";
import { Loader2 } from "lucide-vue-next";
const { isMobile } = useMobile()
import { useFolder } from "~/services/folder/useFolder";
import FlashcardsScroller from "~/components/Flashcard/FlashcardsScroller.vue";
import EditFolder from "~/components/Folder/EditFolder.vue";
import AddContentToFolder from "~/components/Folder/AddContentToFolder.vue";
import CreateFlashcards from "~/components/Flashcard/CreateFlashcards.vue";

useHead({ title: "myStudiz - Folder" });
definePageMeta({
  layout: "dashboard",
  middleware: "auth"
});

const route = useRoute()

const isEditOpen = ref(false)
const isAddContentOpen = ref(false)
const isCreateFlashcardsOpen = ref(false)
const generateWithAI = ref(false)

//Folder
const { data: folder, error: folderError, status: folderStatus, refresh: refreshFolders } = await useFolder().show(route.params.id as UUID)

const flashcardsScrollerRef = ref(null)
const refreshFlashcards = () => {
  if (flashcardsScrollerRef.value) {
    flashcardsScrollerRef.value.refreshFlashcards();
  }
  isCreateFlashcardsOpen.value = false;
};

const handleCreateFlashcards = (withAI: boolean) => {
  isAddContentOpen.value = false
  isCreateFlashcardsOpen.value = true
  generateWithAI.value = withAI;
}
</script>

<template>
  <div class="md:mx-5">
    <div class="flex justify-between items-center">
      <NuxtLink href="/folders" class="inline-flex items-center">
        <Button variant="outlinePrimary" class="group">
          <Icon icon="line-md:arrow-left-circle" class="size-6 text-primary mr-1 group-hover:text-white" />
          <p class="text-primary group-hover:text-white cursor-pointer">Retour aux dossiers</p>
        </Button>
      </NuxtLink>
      <AddContentToFolder v-model:open="isAddContentOpen" @open:create-flashcards="handleCreateFlashcards" />
      <Button @click="isEditOpen = true" v-if="isMobile">
        <Icon icon="line-md:edit-twotone" class="size-6" />
      </Button>
      <Button @click="isEditOpen = true" v-else>
        <Icon icon="line-md:edit-twotone" class="size-6 mr-2" />
        <Label class="cursor-pointer">Modifier le dossier</Label>
      </Button>
    </div>
    <div v-if="folderError" class="flex justify-center my-10">
      <p>Une erreur est survenue lors de la récupération du contenu du dossier : {{ folderError }} </p>
    </div>
    <div class="w-full flex mt-5 mb-1 justify-between">
      <div class="flex">
        <Icon icon="line-md:folder-twotone" class="mr-2 text-primary size-10" />
        <p class="mr-4 text-4xl font-bold opacity-90">
          {{ folder.name }}
        </p>
        <Loader2 v-if="folderStatus === 'pending'" class="size-10 animate-spin text-primary" />
      </div>
    </div>
    <TagsInput class="-ml-2" :model-value="folder.tags" readonly>
      <TagsInputItem v-for="tag in folder.tags" :key="tag" :value="tag">
        <Icon icon="lucide:tags" class="ml-1 text-primary size-4" />
        <TagsInputItemText />
      </TagsInputItem>
    </TagsInput>
    <div class="inline-flex items-center md:ml-1 mt-3">
      <Icon icon="proicons:text-description" class="text-primary mr-2 size-4" />
      <p class="opacity-80 text-sm md:text-normal">{{ folder.description }}</p>
    </div>

    <!-- List Flashcards -->
    <div class="mt-5">
      <FlashcardsScroller ref="flashcardsScrollerRef" :folderId="folder.id" />
    </div>

    <!-- List Notes -->
    <div class="mt-2">

    </div>

    <EditFolder v-model:open="isEditOpen" :folder="folder as Folder" @update:folder="refreshFolders" />
    <CreateFlashcards v-model:open="isCreateFlashcardsOpen" :generateWithAI="generateWithAI" :folderId="folder.id" @create:flashcards="refreshFlashcards" />
  </div>
</template>

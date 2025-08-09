<script setup lang="ts">
import { Icon } from "@iconify/vue";
const { isMobile } = useMobile()

const emit = defineEmits<{
  (e: 'open:create-flashcards', withAI: boolean): void
}>()

const handleCreateFlashcards = () => {
  emit('open:create-flashcards', false)
}

const handleCreateFlashcardsWithAI = () => {
  emit('open:create-flashcards', true)
}
</script>

<template>
  <Drawer v-if="isMobile">
    <DialogTrigger>
      <div class="fixed bottom-16 md:bottom-2 right-2 z-40">
        <Button variant="fab">
          <Icon icon="zondicons:add-solid" class="text-primary size-14 hover:text-primary/70 transition-all" />
        </Button>
      </div>
    </DialogTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Ajouter du contenu</DrawerTitle>
        <DrawerDescription>Sélectionnez le type de contenu que vous souhaitez ajouter</DrawerDescription>
      </DrawerHeader>
      <div class="flex flex-col gap-3 items-center mt-2 mb-5">
        <div class="flex flex-row gap-3">
          <button class="group w-36 h-36 outline-none border-2 border-purple-600 hover:bg-purple-600 rounded-[90px_5px_5px_5px] ease-in-out shadow-lg transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center" @click="handleCreateFlashcardsWithAI">
            <Icon icon="line-md:cloud-alt-loop" class="size-11 text-purple-600 group-hover:text-white" />
            <p class="text-purple-600 group-hover:text-white font-semibold text-md text-center mt-3 px-3">Générer des flashcards avec l'IA</p>
          </button>
          <button class="group w-36 h-36 outline-none border-2 border-primary hover:bg-primary rounded-[5px_90px_5px_5px] shadow-lg transition-all duration-200 ease-in-out hover:scale-1105 flex flex-col items-center justify-center" @click="handleCreateFlashcards">
            <Icon icon="line-md:document-add" class="size-11 text-primary group-hover:text-white" />
            <p class="text-primary group-hover:text-white font-semibold text-md text-center mt-3 px-3">Créer des flashcards</p>
          </button>
        </div>
        <div class="flex flex-row gap-3">
          <button class="group w-36 h-36 outline-none border-2 border-green-600 hover:bg-green-600 rounded-[5px_5px_5px_90px] shadow-lg transition-all duration-200 ease-in-out hover:scale-1105 flex flex-col items-center justify-center">
            <Icon icon="line-md:align-center" class="size-11 text-green-600 group-hover:text-white" />
            <p class="text-green-600 group-hover:text-white font-semibold text-md text-center mt-3 px-4">Créer une note</p>
          </button>
          <button class="group w-36 h-36 outline-none border-2 border-blue-600 hover:bg-blue-600 rounded-[5px_5px_90px_5px] shadow-lg transition-all duration-200 ease-in-out hover:scale-105 flex flex-col items-center justify-center">
            <Icon icon="line-md:upload-loop" class="size-11 text-blue-600 group-hover:text-white" />
            <p class="text-blue-600 group-hover:text-white font-semibold text-md text-center mt-3 px-3">Importer un fichier</p>
          </button>
        </div>
      </div>
    </DrawerContent>
  </Drawer>
  <Dialog v-else>
    <DialogTrigger>
      <Button>
        <Icon icon="basil:add-outline" class="mr-1 size-6" />
        <p class="cursor-pointer">Ajouter du contenu</p>
      </Button>
    </DialogTrigger>
    <DialogContent class="max-w-fit">
      <DialogHeader>
        <DialogTitle>Ajouter du contenu</DialogTitle>
        <DialogDescription>Sélectionnez le type de contenu que vous souhaitez ajouter</DialogDescription>
      </DialogHeader>
      <div class="flex flex-col gap-3 items-center mt-2">
        <div class="flex flex-row gap-3">
          <button class="group w-56 h-56 outline-none border-2 border-purple-600 hover:bg-purple-600 rounded-[90px_5px_5px_5px] ease-in-out shadow-lg transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center" @click="handleCreateFlashcardsWithAI">
            <Icon icon="line-md:cloud-alt-loop" class="size-11 text-purple-600 group-hover:text-white" />
            <p class="text-purple-600 group-hover:text-white font-semibold text-md text-center mt-3 px-3">Générer des flashcards avec l'IA</p>
          </button>
          <button class="group w-56 h-56 outline-none border-2 border-primary hover:bg-primary rounded-[5px_90px_5px_5px] shadow-lg transition-all duration-200 ease-in-out hover:scale-105 flex flex-col items-center justify-center" @click="handleCreateFlashcards">
            <Icon icon="line-md:document-add" class="size-11 text-primary group-hover:text-white" />
            <p class="text-primary group-hover:text-white font-semibold text-md text-center mt-3 px-3">Créer des flashcards</p>
          </button>
        </div>
        <div class="flex flex-row gap-3">
          <button class="group w-56 h-56 outline-none border-2 border-green-600 hover:bg-green-600 rounded-[5px_5px_5px_90px] shadow-lg transition-all duration-200 ease-in-out hover:scale-105 flex flex-col items-center justify-center">
            <Icon icon="line-md:align-center" class="size-11 text-green-600 group-hover:text-white" />
            <p class="text-green-600 group-hover:text-white font-semibold text-md text-center mt-3 px-3">Créer une note</p>
          </button>
          <button class="group w-56 h-56 outline-none border-2 border-blue-600 hover:bg-blue-600 rounded-[5px_5px_90px_5px] shadow-lg transition-all duration-200 ease-in-out hover:scale-105 flex flex-col items-center justify-center">
            <Icon icon="line-md:upload-loop" class="size-11 text-blue-600 group-hover:text-white" />
            <p class="text-blue-600 group-hover:text-white font-semibold text-md text-center mt-3 px-3">Importer un fichier</p>
          </button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
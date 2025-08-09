<script setup lang="ts">
import type { UUID } from "node:crypto";
import { Icon } from "@iconify/vue";
import { Carousel, CarouselContent, CarouselItem } from "~/components/ui/carousel";
import type { Flashcard } from "~/types/flashcard";
import DeleteFlashcard from "~/components/Flashcard/DeleteFlashcard.vue";
import EditFlashcard from "~/components/Flashcard/EditFlashcard.vue";
import { useFlashcard } from "~/services/flashcard/useFlashcard";
import { Loader2 } from "lucide-vue-next";
const { isMobile } = useMobile()
const { isCollapsed, isOpen } = useSidebar()

const props = defineProps<{
  folderId: UUID
}>()

const isFlashcardDeleteOpen = inject<Ref<boolean>>('isFlashcardDeleteOpen')
const flashcardIdToDelete = inject<Ref<UUID | null>>('flashcardIdToDelete')
const handleDeleteFlashcard = (flashcardId: UUID) => {
  if (!flashcardId) return
  flashcardIdToDelete.value = flashcardId
  isFlashcardDeleteOpen.value = true
}

//Flashcards
const { data: flashcards, status: flashcardsStatus, error: flashcardsError, refresh: refreshFlashcards } = await useFlashcard().showAll(props.folderId)

defineExpose({
  refreshFlashcards,
})

const handleFlashcardDeleted = () => {
  refreshFlashcards()
}

const search = ref('')
const filteredFlashcards = computed(() => {
  const query = search.value.toLowerCase()
  if (!flashcards.value) return []
  const sortedFlashcards = [...flashcards.value].sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt)
  })
  return sortedFlashcards.filter(flashcard =>
      flashcard.question.toLowerCase().includes(query)
  )
})

const screenWidth = ref(0);

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  updateScreenWidth();
  window.addEventListener("resize", updateScreenWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenWidth);
});

const flashcardToEdit = ref<Flashcard | null>(null)
const isEditOpen = ref(false)

const handleEditOpen = (flashcard) => {
  flashcardToEdit.value = flashcard
  isEditOpen.value = true
}

const handleUpdateFlashcard = () => {
  flashcardToEdit.value = null
  isEditOpen.value = false
  refreshFlashcards()
}
</script>

<template>
  <div class="w-full inline-flex items-center">
    <Icon icon="arcticons:flashcards" class="text-primary mr-1 size-9" />
    <p v-if="flashcards" class="font-bold text-primary">
      Flashcards ({{ filteredFlashcards.length }})
    </p>
    <p v-else class="font-bold text-primary">
      Flashcards (0)
    </p>
    <Loader2 v-if="flashcardsStatus === 'pending'" class="size-8 animate-spin text-primary ml-2" />
    <div class="flex w-1/2 ml-auto md:w-1/4">
      <Input v-model="search" :placeholder="isMobile ? 'Rechercher...' : 'Rechercher une flashcard...'" />
    </div>
  </div>
  <div v-if="flashcardsError && flashcardsError.statusCode !== 404" class="flex justify-center my-6">
    <p class="text-gray-500 font-bold">Une erreur est survenue lors de la récupération des flashcards : {{ flashcardsError.message }}</p>
  </div>
  <div v-else-if="!flashcards || flashcards.length === 0" class="flex justify-center my-5">
    <p class="text-gray-500 font-bold">Aucune flashcard dans ce dossier</p>
  </div>
  <div v-else-if="filteredFlashcards.length === 0" class="flex justify-center my-5">
    <p class="text-gray-500 font-bold">Aucune flashcard trouvée avec cette recherche</p>
  </div>
  <Carousel
      class="p-2 -mt-2"
      :style="{
    maxWidth:
      isOpen
        ? screenWidth - 100 + 'px'
        : screenWidth < 768
          ? screenWidth - 30 + 'px'
          : isMobile
            ? screenWidth - 40 + 'px'
            : !isCollapsed
              ? screenWidth - 250 + 'px'
              : screenWidth - 130 + 'px'
  }"
  >
  <CarouselContent>
      <CarouselItem
          v-for="(flashcard, index) in filteredFlashcards"
          :key="index"
          class="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
          @click="handleEditOpen(flashcard)"
      >
        <Card class="h-44 flex flex-col justify-between cursor-pointer border-2 border-transparent hover:border-primary">
          <CardHeader>
            <CardTitle class="text-md line-clamp-3">{{ flashcard.question }}</CardTitle>
          </CardHeader>
          <CardFooter class="flex justify-end">
            <ClientOnly>
              <div class="text-end" @click.stop>
                <DropdownMenu>
                  <DropdownMenuTrigger class="mt-1">
                    <Button class="size-6" variant="outline" size="icon">
                      <Icon icon="radix-icons:dots-vertical" class="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem class="flex items-center gap-2 text-primary" @click="handleEditOpen(flashcard)">
                      <Icon icon="line-md:edit-twotone" class="size-5 text-primary" />
                      <span class="text-sm text-primary">Modifier la flashcard</span>
                    </DropdownMenuItem>
                    <Separator />
                    <DropdownMenuItem class="flex items-center gap-2 text-destructive" @click="handleDeleteFlashcard(flashcard.id)">
                      <Icon icon="line-md:file-remove" class="size-5 text-destructive" />
                      <span class="text-sm text-destructive">Supprimer la flashcard</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </ClientOnly>
          </CardFooter>
        </Card>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious class="-left-0.5 md:-left-2" />
    <CarouselNext class="-right-4 md:-right-2" />
  </Carousel>
  <EditFlashcard v-if="flashcardToEdit" v-model:open="isEditOpen" :flashcard="flashcardToEdit" @update:flashcard="handleUpdateFlashcard" />
  <DeleteFlashcard @flashcardDeleted="handleFlashcardDeleted" />
</template>
<script setup lang="ts">
import type { UUID } from "node:crypto";
import { Loader2 } from "lucide-vue-next";
import { Icon } from "@iconify/vue";
const { isMobile } = useMobile()
import { useFlashcard } from "~/services/flashcard/useFlashcard";

const emit = defineEmits(['flashcardDeleted']);

const isFlashcardDeleteOpen = inject<Ref<boolean>>('isFlashcardDeleteOpen')
const flashcardIdToDelete = inject<Ref<UUID | null>>('flashcardIdToDelete')

const deleteLoading = ref(false)

const handleClose = () => {
  isFlashcardDeleteOpen.value = false
  flashcardIdToDelete.value = null
}

const handleDelete = async () => {
  try {
    deleteLoading.value = true
    await useFlashcard().remove(flashcardIdToDelete.value)
    emit('flashcardDeleted')
  } catch (error) {
    console.error(error)
  } finally {
    deleteLoading.value = false
    flashcardIdToDelete.value = null
    isFlashcardDeleteOpen.value = false
  }
}
</script>

<template>
  <!-- Dialog -->
  <Dialog v-if="!isMobile" v-model:open="isFlashcardDeleteOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Êtes-vous sûr ?</DialogTitle>
        <DialogDescription>
          Vous allez supprimer définitivement cette flashcard. Cette action est irréversible.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <div class="flex justify-between w-full">
          <Button variant="outlinePrimary" @click="handleClose">Annuler</Button>
          <Button :disabled="deleteLoading" type="submit" variant="destructive" @click="handleDelete">
            <Loader2 v-if="deleteLoading" class="mr-1 size-6 animate-spin" />
            <Icon v-else class="mr-1 size-5" icon="line-md:folder-remove-twotone" />
            <Label v-if="!deleteLoading" class="cursor-pointer">
              Supprimer
            </Label>
            <Label v-else>
              Suppression...
            </Label>
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- Drawer -->
  <Drawer v-else v-model:open="isFlashcardDeleteOpen">
    <DrawerContent>
      <div class="mx-auto w-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Êtes-vous sûr ?</DrawerTitle>
          <DrawerDescription>
            Vous allez supprimer définitivement cette flashcard. Cette action est irréversible.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button :disabled="deleteLoading" type="submit" variant="destructive" @click="handleDelete">
            <Loader2 v-if="deleteLoading" class="mr-1 size-6 animate-spin" />
            <Icon v-else class="mr-1 size-6" icon="line-md:folder-remove-twotone" />
            <Label v-if="!deleteLoading" class="cursor-pointer">
              Supprimer
            </Label>
            <Label v-else>
              Suppression...
            </Label>
          </Button>
          <Button variant="outlinePrimary" @click="handleClose">Annuler</Button>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
</template>
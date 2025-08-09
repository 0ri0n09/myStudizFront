<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { UUID } from "node:crypto";
import type { Folder } from "~/types/folder";
import { Loader2 } from "lucide-vue-next";
import { useFolder } from "~/services/folder/useFolder";
import SelectFolderFilter from "~/components/Folder/SelectFolderFilter.vue";
import CreateFolder from "~/components/Folder/CreateFolder.vue";

useHead({ title: "myStudiz - Folders" });
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const { isMobile } = useMobile()
const { isOpen: isSidebarOpen } = useSidebar()

const { data: folders, status, refresh } = await useFolder().showAll()

const search = ref('')
const filteredFolders = computed(() => {
  if (!search.value) return folders.value
  const query = search.value.toLowerCase()
  return folders.value.filter(folder => {
    const nameMatch = folder.name.toLowerCase().includes(query)
    const tagMatch = folder.tags?.some(tag => tag.toLowerCase().includes(query))
    return nameMatch || tagMatch
  })
})

// Create folder
const isCreateOpen = ref(false)

// Delete folder
const deleteLoading = ref(false);
const isDialogOpen = ref(false);
const isDrawerOpen = ref(false);
const folderIdToDelete = ref<string | null>(null);

const handleRequestDelete = (folderId: UUID) => {
  folderIdToDelete.value = folderId;
  if (isMobile.value) {
    isDrawerOpen.value = true;
  } else {
    isDialogOpen.value = true;
  }
}

const deleteFolder = async () => {
  try {
    deleteLoading.value = true
    await useFolder().remove(folderIdToDelete.value)
    await refresh()
  } catch (error) {
    console.error(error)
  } finally {
    deleteLoading.value = false
    isDialogOpen.value = false;
    isDrawerOpen.value = false;
    folderIdToDelete.value = null;
  }
}

const cancelDelete = () => {
  folderIdToDelete.value = null;
  isDialogOpen.value = false;
  isDrawerOpen.value = false;
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center space-x-3">
      <div class="flex justify-start">
        <SelectFolderFilter />
      </div>
      <div class="flex justify-center">
        <Button v-if="!isMobile" @click="isCreateOpen = true">
          <Icon class="mr-1 size-6" icon="basil:add-outline" />
          <p class="cursor-pointer">
            Ajouter un dossier
          </p>
        </Button>
      </div>
      <div class="flex justify-end">
        <Input v-model="search" placeholder="Rechercher..." />
      </div>
    </div>

    <div class="my-3">
      <div v-if="status === 'pending'" class="flex justify-center my-10">
        <Loader2 class="size-10 animate-spin text-primary" />
      </div>
      <div v-if="folders.length === 0" class="my-14 text-center text-gray-500">
        <p v-if="isMobile">Aucun dossier trouvé, ajoutez un dossier avec le bouton '+'</p>
        <p v-else>Aucun dossier trouvé, ajoutez un dossier avec le bouton '+' ci-dessus</p>
      </div>
      <div v-else class="flex flex-wrap gap-4 justify-center mb-32">
        <Folder
            v-for="folder in filteredFolders"
            :key="folder.id"
            :folder="folder"
            class="w-full max-w-full md:w-[340px] md:max-w-[340px] shrink-0 border-2 rounded-lg shadow-md cursor-pointer border-2 border-transparent hover:border-primary"
            :style="{ borderLeft: `8px solid ${ folder.color || '#fe5934' }` }"
            @requestDelete="handleRequestDelete"
            @update:folder="refresh"
        />
      </div>
    </div>

    <!-- Create folder -->
    <Button v-if="isMobile && !isSidebarOpen" @click="isCreateOpen = true">
      <div class="fixed bottom-16 md:bottom-2 right-2 z-40">
        <Button variant="fab">
          <Icon icon="zondicons:add-solid" class="text-primary size-14 hover:text-primary/70 transition-all" />
        </Button>
      </div>
    </Button>
    <CreateFolder v-model:open="isCreateOpen" @create:folder="refresh" />

    <!-- Delete folder dialog -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Êtes-vous sûr ?</DialogTitle>
          <DialogDescription>
            Vous allez supprimer définitivement ce dossier. Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div class="flex justify-between w-full">
            <Button variant="outlinePrimary" @click="cancelDelete">Annuler</Button>
            <Button :disabled="deleteLoading" type="submit" variant="destructive" @click="deleteFolder">
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

    <!-- Delete folder drawer -->
    <Drawer v-model:open="isDrawerOpen">
      <DrawerContent>
        <div class="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Êtes-vous sûr ?</DrawerTitle>
            <DrawerDescription>
              Vous allez supprimer définitivement ce dossier. Cette action est irréversible.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button :disabled="deleteLoading" type="submit" variant="destructive" @click="deleteFolder">
              <Loader2 v-if="deleteLoading" class="mr-1 size-6 animate-spin" />
              <Icon v-else class="mr-1 size-6" icon="line-md:folder-remove-twotone" />
              <Label v-if="!deleteLoading" class="cursor-pointer">
                Supprimer
              </Label>
              <Label v-else>
                Suppression...
              </Label>
            </Button>
            <Button variant="outlinePrimary" @click="cancelDelete">Annuler</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</template>

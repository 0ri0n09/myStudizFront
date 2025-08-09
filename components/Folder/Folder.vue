<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import { Icon } from "@iconify/vue";
import EditFolder from "~/components/Folder/EditFolder.vue";
import type { Folder } from "~/types/folder";

const props = defineProps<{
  folder: Folder
}>()

const emit = defineEmits(['requestDelete', 'update:folder'])

const isEditOpen = ref(false)
const isSelected = ref(false)

const showFolder = () => {
  isSelected.value = true
  navigateTo(`/folders/${props.folder.id}`);
}

const handleDelete = () => {
  emit('requestDelete', props.folder.id)
  navigateTo('/folders')
}
</script>

<template>
  <div class="p-2" @click="showFolder" :class="{ 'border-2 border-primary': isSelected }">
    <!-- Titre & Icon Public / Private-->
    <div class="flex justify-between items-start mb-0.5">
      <h2 class="text-lg font-semibold break-words overflow-wrap-anywhere max-w-[80%] inline-flex items-center">
        {{ props.folder.name }}
        <Loader2 v-if="isSelected" class="ml-2 size-5 text-primary animate-spin" />
      </h2>
      <Icon v-if="props.folder.isPublic" icon="mdi:world" class="size-6 text-primary shrink-0" />
      <Icon v-else icon="tdesign:git-repository-private-filled" class="size-6 text-primary shrink-0" />
    </div>

    <!-- Tags -->
    <TagsInput :model-value="props.folder.tags" readonly>
      <TagsInputItem v-for="tag in props.folder.tags" :key="tag" :value="tag" class="cursor-pointer">
        <Icon icon="lucide:tags" class="ml-1 text-primary size-4" />
        <TagsInputItemText />
      </TagsInputItem>
    </TagsInput>

    <!-- Menu -->
    <ClientOnly>
      <div class="text-end" @click.stop>
        <DropdownMenu>
          <DropdownMenuTrigger class="mt-1">
            <Button class="size-6" variant="outline" size="icon">
              <Icon icon="radix-icons:dots-vertical" class="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem class="flex items-center gap-2 text-primary" @click="isEditOpen = true">
              <Icon icon="line-md:edit-twotone" class="size-5 text-primary" />
              <span class="text-sm text-primary">Modifier le dossier</span>
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem class="flex items-center gap-2 text-destructive" @click="handleDelete">
              <Icon icon="line-md:folder-remove-twotone" class="size-5 text-destructive" />
              <span class="text-sm text-destructive">Supprimer la dossier</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </ClientOnly>

    <EditFolder v-model:open="isEditOpen" :folder="props.folder" @update:folder="emit('update:folder')" />
  </div>
</template>
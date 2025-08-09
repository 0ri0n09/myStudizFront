<script setup lang="ts">
import type { UUID } from "node:crypto";
import { Loader2 } from "lucide-vue-next";
import { Icon } from "@iconify/vue";
import { ComboBox } from "~/components/ui/combo-box";
import type { Folder } from "~/types/folder";
import { useCreateFolderSchema } from "~/schemas/folder/createFolder";
import { useFolder } from "~/services/folder/useFolder";
const { isMobile } = useMobile()

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'create:folder'): void
}>();

const form = useForm({
  validationSchema: useCreateFolderSchema(),
  initialValues: {
    name: '',
    description: '',
    isPublic: 'true',
    color: '#fe5934',
    tags: [],
    folderParentId: '',
  }, keepValuesOnUnmount: true
})

const { data: folders } = await useFolder().showAllOptions()

const foldersOptions = computed(() => {
  return folders.value?.map(folder => ({
    value: folder.id,
    label: folder.name
  })) || []
})

const updateFolderParentId = (value) => {
  form.setFieldValue('folderParentId', value)
}

const createLoading = ref<boolean>(false)
const onSubmit = form.handleSubmit(async (values) => {
  const formValues = {
    ...values,
    description: form.values.description,
    tags: Array.from(form.values.tags || []),
    folderParentId: String(form.values.folderParentId || '') as UUID,
  }
  try {
    createLoading.value = true
    await useFolder().create(formValues as Folder)
    emit('create:folder')
    emit('update:open', false)
  } catch (error) {
    console.error(error)
  } finally {
    createLoading.value = false
    form.resetForm()
  }
})
</script>

<template>
  <Drawer v-bind:open="open" @update:open="emit('update:open', $event)" v-if="isMobile">
    <DrawerContent>
      <form @submit="onSubmit">
        <div class="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Créer un dossier</DrawerTitle>
            <DrawerDescription>Ajoutez un nouveau dossier</DrawerDescription>
          </DrawerHeader>
          <div class="space-y-3 mx-4">

            <!-- Name -->
            <div>
              <FormField v-slot="{ componentField }" name="name">
                <FormItem>
                  <FormLabel class="font-semibold">{{ $t('folders.create_folder_name') }}</FormLabel>
                  <FormControl>
                    <Input type="text" v-bind="componentField" variant="outlined" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <!-- Description -->
            <div>
              <FormField v-slot="{ componentField }" name="description">
                <FormItem>
                  <FormLabel class="font-semibold">Description</FormLabel>
                  <FormControl>
                    <Input type="text" v-bind="componentField" variant="outlined" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <!-- isPublic -->
            <div class="w-1/3">
              <FormField v-slot="{ componentField }" name="isPublic">
                <FormItem>
                  <FormLabel class="font-semibold">{{ $t('folders.create_folder_isPublic') }}</FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger>
                        <SelectValue :placeholder="$t('folders.create_folder_visibility_placeholder')" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">
                          <div class="flex items-center gap-2">
                            <Icon icon="mdi:world" class="size-6" />
                            <p>{{ $t('folders.public') }}</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="false">
                          <div class="flex items-center gap-2">
                            <Icon icon="tdesign:git-repository-private-filled" class="size-6" />
                            <p>{{ $t('folders.private') }}</p>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <!-- Color -->
            <div>
              <FormField v-slot="{ componentField }" name="color">
                <FormItem>
                  <FormLabel class="font-semibold">{{ $t('folders.create_folder_color') }}</FormLabel>
                  <FormControl>
                    <Input class="w-20 h-10" type="color" v-bind="componentField" />
                  </FormControl>
                </FormItem>
              </FormField>
            </div>

            <!-- Tags -->
            <div>
              <FormField v-slot="{ value }" name="tags">
                <FormItem>
                  <FormLabel class="font-semibold">Tags</FormLabel>
                  <FormControl>
                    <TagsInput class="py-2 border" :model-value="value">
                      <TagsInputItem v-for="item in value" :key="item" :value="item">
                        <TagsInputItemText />
                        <TagsInputItemDelete />
                      </TagsInputItem>
                      <TagsInputInput placeholder="Tag..." />
                    </TagsInput>
                  </FormControl>
                  <FormDescription>
                    <p>Pour ajouter un tag, entrez le et appuyez sur 'Entrer'</p>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <!-- Parent Folder -->
            <div>
              <FormField name="folderParentId">
                <FormItem class="flex flex-col">
                  <FormLabel class="font-semibold">Ajouter au dossier</FormLabel>
                  <ComboBox
                      :options="foldersOptions"
                      name="folderParentId"
                      label=""
                      placeholder="Choisir un dossier..."
                      search-placeholder="Rechercher un dossier..."
                      description="Sélectionnez le dossier auquel cet élément sera associé."
                      :model-value="form.values.folderParentId"
                      @update:model-value="updateFolderParentId"
                  />
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

          </div>
          <DrawerFooter>
            <Button :disabled="createLoading" type="submit" variant="default">
              <Loader2 v-if="createLoading" class="mr-1 size-6 animate-spin" />
              <Icon v-else class="mr-1 size-6" icon="basil:add-outline" />
              <p v-if="!createLoading" class="cursor-pointer">
                Créer
              </p>
              <p v-else>
                Création...
              </p>
            </Button>
            <DrawerClose as-child>
              <Button variant="outline">
                Annuler
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </form>
    </DrawerContent>
  </Drawer>
  <Dialog v-bind:open="open" @update:open="emit('update:open', $event)" v-else>
    <DialogContent class="w-3/4 h-screen md:h-min overflow-y-auto rounded-lg">
      <DialogHeader>
        <DialogTitle>{{ $t('folders.create_new_folder') }}</DialogTitle>
        <DialogDescription>
          {{ $t('folders.create_new_folder_description') }}
        </DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit">
        <div class="space-y-3">

          <!-- Name -->
          <div>
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel class="font-semibold">{{ $t('folders.create_folder_name') }}</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" variant="outlined" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Description -->
          <div>
            <FormField v-slot="{ componentField }" name="description">
              <FormItem>
                <FormLabel class="font-semibold">Description</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" variant="outlined" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- isPublic -->
          <div class="w-1/3">
            <FormField v-slot="{ componentField }" name="isPublic">
              <FormItem>
                <FormLabel class="font-semibold">{{ $t('folders.create_folder_isPublic') }}</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue :placeholder="$t('folders.create_folder_visibility_placeholder')" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">
                        <div class="flex items-center gap-2">
                          <Icon icon="mdi:world" class="size-6" />
                          <p>{{ $t('folders.public') }}</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="false">
                        <div class="flex items-center gap-2">
                          <Icon icon="tdesign:git-repository-private-filled" class="size-6" />
                          <p>{{ $t('folders.private') }}</p>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Color -->
          <div>
            <FormField v-slot="{ componentField }" name="color">
              <FormItem>
                <FormLabel class="font-semibold">{{ $t('folders.create_folder_color') }}</FormLabel>
                <FormControl>
                  <Input class="w-20 h-10" type="color" v-bind="componentField" />
                </FormControl>
              </FormItem>
            </FormField>
          </div>

          <!-- Tags -->
          <div>
            <FormField v-slot="{ value }" name="tags">
              <FormItem>
                <FormLabel class="font-semibold">Tags</FormLabel>
                <FormControl>
                  <TagsInput class="py-2 border" :model-value="value">
                    <TagsInputItem v-for="item in value" :key="item" :value="item">
                      <TagsInputItemText />
                      <TagsInputItemDelete />
                    </TagsInputItem>
                    <TagsInputInput placeholder="Tag..." />
                  </TagsInput>
                </FormControl>
                <FormDescription>
                  <p>Pour ajouter un tag, entrez le et appuyez sur 'Entrer'</p>
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Parent Folder -->
          <div>
            <FormField name="folderParentId">
              <FormItem class="flex flex-col">
                <FormLabel class="font-semibold">Ajouter au dossier</FormLabel>
                <ComboBox
                    :options="foldersOptions"
                    name="folderParentId"
                    label=""
                    placeholder="Choisir un dossier..."
                    search-placeholder="Rechercher un dossier..."
                    description="Sélectionnez le dossier auquel cet élément sera associé."
                    :model-value="form.values.folderParentId"
                    @update:model-value="updateFolderParentId"
                />
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

        </div>
        <DialogFooter>
          <div class="flex justify-between w-full">
            <DialogClose as-child>
              <Button variant="outlinePrimary">
                {{ $t('folders.create_cancel') }}
              </Button>
            </DialogClose>

            <!-- Submit -->
            <Button :disabled="createLoading" type="submit" variant="default">
              <Loader2 v-if="createLoading" class="mr-1 size-6 animate-spin" />
              <Icon v-else class="mr-1 size-6" icon="basil:add-outline" />
              <p v-if="!createLoading" class="cursor-pointer">
                Créer le dossier
              </p>
              <p v-else>
                Création...
              </p>
            </Button>
          </div>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
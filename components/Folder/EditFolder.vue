<script setup lang="ts">
  import { Icon } from "@iconify/vue";
  import type { Folder } from "~/types/folder";
  import type { UUID } from "node:crypto";
  const { isMobile } = useMobile()
  import { Loader2 } from "lucide-vue-next";
  import { useCreateFolderSchema } from "~/schemas/folder/createFolder";
  import { useForm } from "vee-validate";
  import { useFolder } from "~/services/folder/useFolder";

  const props = defineProps<{
    folder: Folder
    open: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'update:folder'): void
  }>();

  const editLoading = ref<boolean>(false)

  const createFolderSchema = useCreateFolderSchema();
  const form = useForm({
    validationSchema: createFolderSchema,
    keepValuesOnUnmount: true
  })

  watch(() => props.folder, (folder) => {
    form.setValues({
      name: folder.name,
      description: folder.description,
      isPublic: String(folder.isPublic),
      color: folder.color,
      tags: folder.tags,
      folderParentId: folder.folderParentId,
    })
  }, { immediate: true })

  //const { data: folders, status } = await useFolder().showAllOptions()

  /*const foldersOptions = computed(() => {
    return (
        folders.value
            ?.filter(folder => folder.id !== props.folder.id)
            .map(folder => ({
              value: folder.id,
              label: folder.name,
            })) || []
    )
  })*/

  /*const updateFolderParentIdupdateFolderParentId = (value) => {
    form.setFieldValue('folderParentId', value)
  }*/

  const onSubmit = form.handleSubmit(async (values) => {
    const formValues = {
      id: props.folder.id,
      ...values,
      description: form.values.description,
      tags: Array.from(form.values.tags || []),
      //folderParentId: String(form.values.folderParentId || '') as UUID,
    }
    try {
      editLoading.value = true
      await useFolder().edit(formValues as Folder)
      emit('update:folder')
      emit('update:open', false)
      form.resetForm()
    } catch (error) {
      console.error(error)
    } finally {
      editLoading.value = false
    }
  })
</script>

<template>
  <Drawer v-bind:open="open" @update:open="emit('update:open', $event)" v-if="isMobile">
    <DrawerContent>
      <form @submit="onSubmit">
        <div class="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Modifier le dossier</DrawerTitle>
            <DrawerDescription>Remplissez les champs ci-dessous</DrawerDescription>
          </DrawerHeader>
          <div class="mx-4">

            <!-- Name -->
            <div class="my-3">
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
            <div class="my-3">
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
            <div class="w-1/3 my-3">
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
            <div class="my-3">
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
            <div class="my-3">
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

            <!-- Parent Folder
            <div class="my-3">
              <FormField name="folderParentId">
                <FormItem class="flex flex-col">
                  <FormLabel class="font-semibold">Ajouter au dossier</FormLabel>
                  <div v-if="status === 'pending'" class="flex items-center justify-center my-10">
                    <Loader2 class="size-10 animate-spin m-2 text-primary" />
                    <p class="font-semibold text-primary">Chargement des dossiers...</p>
                  </div>
                  <ComboBox v-else
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
            -->
          </div>
          <DrawerFooter>
            <!-- Submit -->
            <Button :disabled="editLoading" type="submit" variant="default">
              <Loader2 v-if="editLoading" class="mr-1 size-6 animate-spin" />
              <Icon v-else class="mr-1 size-6" icon="basil:add-outline" />
              <p v-if="!editLoading" class="cursor-pointer">
                Modifier
              </p>
              <p v-else>
                Modification...
              </p>
            </Button>
            <DrawerClose as-child>
              <Button variant="outlinePrimary">
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
        <DrawerTitle>Modifier le dossier</DrawerTitle>
        <DrawerDescription>Remplissez les champs ci-dessous</DrawerDescription>
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
                          <Label>{{ $t('folders.public') }}</Label>
                        </div>
                      </SelectItem>
                      <SelectItem value="false">
                        <div class="flex items-center gap-2">
                          <Icon icon="tdesign:git-repository-private-filled" class="size-6" />
                          <Label>{{ $t('folders.private') }}</Label>
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
                  <Label>Pour ajouter un tag, entrez le et appuyez sur 'Entrer'</Label>
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Parent Folder
          <div>
            <FormField name="folderParentId">
              <FormItem class="flex flex-col">
                <FormLabel class="font-semibold">Ajouter au dossier</FormLabel>
                <div v-if="status === 'pending'" class="flex items-center justify-center my-10">
                  <Loader2 class="size-10 animate-spin m-2 text-primary" />
                  <Label class="font-semibold text-primary">Chargement des dossiers...</Label>
                </div>
                <ComboBox v-else
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
          -->

        </div>
        <DialogFooter>
          <div class="flex justify-between w-full">
            <DialogClose as-child>
              <Button type="button" variant="outlinePrimary">
                {{ $t('folders.create_cancel') }}
              </Button>
            </DialogClose>

            <!-- Submit -->
            <Button :disabled="editLoading" type="submit">
              <Loader2 v-if="editLoading" class="mr-1 size-6 animate-spin" />
              <Icon v-else class="mr-1 size-6" icon="basil:add-outline" />
              <p v-if="!editLoading" class="cursor-pointer">
                Valider
              </p>
              <p v-else>
                Modification...
              </p>
            </Button>
          </div>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import { Icon } from "@iconify/vue";
import { useEditPasswordSchema } from "~/schemas/auth/editPassword";
import { useAuthStore } from "~/stores/useAuthStore";
const { isMobile } = useMobile()

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'edit:password'): void
}>();

const form = useForm({
  validationSchema: useEditPasswordSchema(),
  initialValues: {
    password: '',
    password_confirmation: '',
    password_old: '',
  }
})
const { isFieldDirty, handleSubmit, meta } = form
const isFormDirty = computed(() => {
  return meta.value.dirty
})

const auth = useAuthStore()

const editLoading = ref<boolean>(false)

const onSubmit = handleSubmit(async (values) => {
  try {
    editLoading.value = true
    await auth.editPassword(values)
    emit("edit:password")
    emit("update:open", false)
  } catch (error) {
    console.error(error)
  } finally {
    editLoading.value = false
    form.resetForm()
  }
})
</script>

<template>
  <Drawer v-if="isMobile" v-bind:open="open" @update:open="emit('update:open', $event)">
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Changer votre mot de passe</DrawerTitle>
        <DrawerDescription>
          Remplissez les champs ci-dessous
        </DrawerDescription>
      </DrawerHeader>
      <form @submit="onSubmit">

        <div class="space-y-3 mx-4">
          <!-- OLD Password -->
          <div>
            <FormField v-slot="{ componentField }" name="password_old" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel class="font-semibold">Ancien mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" variant="outlined" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Password -->
          <div>
            <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel class="font-semibold">{{ $t('register.password') }}</FormLabel>
                <FormControl>
                  <Input type="password" variant="outlined" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Password confirmation-->
          <div>
            <FormField v-slot="{ componentField }" name="password_confirmation" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel class="font-semibold">{{ $t('register.password_confirmation') }}</FormLabel>
                <FormControl>
                  <Input type="password" variant="outlined" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <DrawerFooter>
          <!-- Submit -->
          <Button :disabled="editLoading || !isFormDirty" type="submit">
            <Loader2 v-if="editLoading" class="mr-1 size-6 animate-spin" />
            <Icon v-else class="mr-2 size-6" icon="line-md:edit-twotone" />
            <p v-if="!editLoading" class="cursor-pointer">
              Modifier votre mot de passe
            </p>
            <p v-else>
              Modification...
            </p>
          </Button>
          <DialogClose as-child>
            <Button variant="outlinePrimary">
              <p>Annuler</p>
            </Button>
          </DialogClose>
        </DrawerFooter>
      </form>
    </DrawerContent>
  </Drawer>
  <Dialog v-else v-bind:open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Changer votre mot de passe</DialogTitle>
        <DialogDescription>
          Remplissez les champs ci-dessous
        </DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit">

        <div class="space-y-3">
          <!-- OLD Password -->
          <div>
            <FormField v-slot="{ componentField }" name="password_old" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel class="font-semibold">Ancien mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" variant="outlined" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Password -->
          <div>
            <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel class="font-semibold">{{ $t('register.password') }}</FormLabel>
                <FormControl>
                  <Input type="password" variant="outlined" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Password confirmation-->
          <div>
            <FormField v-slot="{ componentField }" name="password_confirmation" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel class="font-semibold">{{ $t('register.password_confirmation') }}</FormLabel>
                <FormControl>
                  <Input type="password" variant="outlined" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <DialogFooter>
          <div class="flex justify-between w-full">
            <DialogClose as-child>
              <Button variant="outlinePrimary">
                <p>Annuler</p>
              </Button>
            </DialogClose>

            <!-- Submit -->
            <Button :disabled="editLoading || !isFormDirty" type="submit">
              <Loader2 v-if="editLoading" class="mr-1 size-6 animate-spin" />
              <Icon v-else class="mr-1 size-6" icon="line-md:edit-twotone" />
              <p v-if="!editLoading" class="cursor-pointer">
                Modifier votre mot de passe
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

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Loader2 } from "lucide-vue-next";
import { useProfileSchema } from "~/schemas/auth/profile";
import { useAuthStore } from "~/stores/useAuthStore";
import type { User } from "~/types/user";
import SelectGender from "~/components/User/SelectGender.vue";
import SelectCountry from "~/components/User/SelectCountry.vue";
import EditPassword from "~/components/User/EditPassword.vue";

useHead({ title: "myStudiz - Profile" });
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
})

const isEditPasswordOpen = ref<boolean>(false)

const { user } = storeToRefs(useAuthStore())
const auth = useAuthStore()
const editLoading = ref<boolean>(false)

const form = useForm({
  validationSchema: useProfileSchema(),
  initialValues: {
    username: user.value.username,
    email: user.value.email,
    gender: user.value.gender,
    country: user.value.country,
  },
})
const { isFieldDirty, handleSubmit, meta } = form
const isFormDirty = computed(() => {
  return meta.value.dirty
})

const onSubmit = handleSubmit(async (values) => {
  try {
    editLoading.value = true
    const updatedUser = await auth.editUser(values as User)
    if (updatedUser) {
      auth.user = updatedUser
      form.resetForm({
        values: {
          username: updatedUser.username,
          email: updatedUser.email,
          gender: updatedUser.gender,
          country: updatedUser.country,
        }
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    editLoading.value = false
  }
})
</script>

<template>
  <div class="flex justify-center">
    <form class="space-y-4 p-4 w-full md:w-3/4" @submit="onSubmit">

      <div>
        <FormField v-slot="{ componentField }" name="username" :validate-on-blur="!isFieldDirty">
          <FormItem>
            <FormLabel class="font-bold">Nom d'utilisateur</FormLabel>
            <FormControl>
              <Input type="text" placeholder="JohnDoe42" v-bind="componentField" />
            </FormControl>
            <FormDescription>
              Ceci est votre nom d'utilisateur public
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <div>
        <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
          <FormItem>
            <FormLabel class="font-bold">Email</FormLabel>
            <FormControl>
              <Input disabled type="email" :placeholder="user.email" v-bind="componentField" />
            </FormControl>
            <FormDescription>
              Vous ne pouvez pas modifier votre email
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <div>
        <Button class="md:w-1/3" type="button" @click="isEditPasswordOpen = true">
          <Icon icon="line-md:edit-twotone" class="size-5 mr-2" />
          <p>Changer votre mot de passe</p>
        </Button>
      </div>

      <div>
        <FormField v-slot="{ componentField }" name="gender" :validate-on-blur="!isFieldDirty">
          <FormItem>
            <FormLabel class="font-bold">Genre</FormLabel>
            <FormControl>
              <SelectGender v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
      </div>

      <div>
        <FormField v-slot="{ componentField }" name="country" :validate-on-blur="!isFieldDirty">
          <FormItem>
            <FormLabel class="font-bold">Pays</FormLabel>
            <FormControl>
              <SelectCountry v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
      </div>

      <!-- Submit -->
      <div class="text-center">
        <Button :disabled="editLoading || !isFormDirty" type="submit">
          <Loader2 v-if="editLoading" class="mr-1 size-6 animate-spin" />
          <Icon v-else icon="line-md:edit-twotone" class="mr-1 size-6" />
          <p v-if="!editLoading" class="cursor-pointer">
            Modifier vos informations
          </p>
          <p v-else>
            Modification...
          </p>
        </Button>
      </div>
    </form>

    <EditPassword v-model:open="isEditPasswordOpen" @edit:password="isEditPasswordOpen= false" />
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { useForm } from "vee-validate";
import { useRegisterSchema } from "~/schemas/auth/register";
import { Icon } from "@iconify/vue";
import { Loader2 } from 'lucide-vue-next';
import SelectCountry from "~/components/User/SelectCountry.vue";
import SelectGender from "~/components/User/SelectGender.vue";

useHead({ title: "myStudiz - Inscription" });
definePageMeta({
  layout: "default",
  middleware: ["guest"],
});

const auth = useAuthStore();
const registerLoading = ref<boolean>(false)

const form = useForm({
  validationSchema: useRegisterSchema(),
  initialValues: {
    gender: '',
    country: '',
  }
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    registerLoading.value = true
    await auth.register(values)
    registerLoading.value = false
  } catch (error) {
    console.error(error)
  } finally {
    registerLoading.value = false
    form.resetForm()
  }
})
</script>

<template>
  <section class="bg-white">
    <div class="flex justify-end p-4">
      <LangSwitcher />
    </div>
    <div class="grid lg:h-screen lg:grid-cols-2">
      <div class="sm:flex items-center justify-center px-4 py-6 bg-primary-600 lg:py-0 sm:px-0 lg:hidden">
        <div class="max-w-md xl:max-w-xl">
          <a href="#" class="flex items-center mb-4 text-2xl font-semibold text-white">
            <NuxtImg class="w-full h-16" src="/images/logo.svg" alt="logo" />
          </a>
          <p class="font-light text-center text-primary-200">
            Rejoignez nos milliers d'étudiants à travers le monde, partagez vos connaissances et améliorez-vous avec l'aide de nos algorithmes d'apprentissages renforcés.
          </p>
        </div>
      </div>
      <div class="flex items-center justify-center px-4 py-6 lg:py-0 sm:px-0">
        <form class="w-full max-w-md space-y-4 md:space-y-6 xl:max-w-xl" @submit="onSubmit">
          <h1 class="text-xl font-bold text-gray-900">
            {{ $t('register.create_account') }}
          </h1>

          <!-- Username -->
          <div>
            <FormField v-slot="{ componentField }" name="username">
              <FormItem>
                <FormLabel class="font-semibold">{{ $t('register.username') }}</FormLabel>
                <FormControl>
                  <Input placeholder="John42" type="text" variant="outlined" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Gender -->
          <div>
            <FormField v-slot="{ componentField }" name="gender">
              <FormItem>
                <FormLabel class="font-semibold">{{ $t('register.gender') }}</FormLabel>
                <FormControl>
                  <SelectGender v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Country -->
          <FormField v-slot="{ componentField }" name="country">
            <FormItem>
              <FormLabel class="font-semibold">{{ $t('register.country') }}</FormLabel>
              <FormControl>
                <SelectCountry v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Email -->
          <div>
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel class="font-semibold">Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@gmail.com" type="email" variant="outlined" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Password -->
          <div>
            <FormField v-slot="{ componentField }" name="password">
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
            <FormField v-slot="{ componentField }" name="password_confirmation">
              <FormItem>
                <FormLabel class="font-semibold">{{ $t('register.password_confirmation') }}</FormLabel>
                <FormControl>
                  <Input type="password" variant="outlined" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Submit -->
          <div class="flex justify-center">
            <Button type="submit" variant="default" :disabled="registerLoading">
              <Loader2 v-if="registerLoading" class="mr-1 size-5 animate-spin" />
              <Icon v-else icon="line-md:login" class="mr-1 size-5" />
              <Label v-if="!registerLoading" class="cursor-pointer">{{ $t('register.register') }}</Label>
              <Label v-else>{{ $t('register.loading') }}</Label>
            </Button>
          </div>

          <!-- Register -->
          <Label class="text-sm font-light text-gray-500">
            {{ $t('register.have_account') }}
            <NuxtLink to="/" class="font-medium text-primary-600 hover:underline hover:text-primary">{{ $t('register.login') }}</NuxtLink>
          </Label>
        </form>
      </div>

      <div class="lg:flex items-center justify-center px-4 py-6 bg-primary-600 lg:py-0 sm:px-0 hidden">
        <div class="max-w-md xl:max-w-xl">
          <a href="#" class="flex items-center mb-4 text-2xl font-semibold text-white">
            <NuxtImg class="w-full h-16" src="/images/logo.svg" alt="logo" />
          </a>
          <p class="mb-44 font-light text-primary-200 text-center">
            Rejoignez nos milliers d'étudiants à travers le monde, partagez vos connaissances et améliorez-vous avec l'aide de nos algorithmes d'apprentissages renforcés.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>

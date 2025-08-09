<script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { useForm } from "vee-validate";
import { useLoginSchema } from "~/schemas/auth/login";
import { Icon } from "@iconify/vue";
import { Loader2 } from 'lucide-vue-next'

useHead({ title: "myStudiz - Connnexion" });
definePageMeta({
  layout: 'default',
  middleware: ["guest"]
});

const isPasswordVisible = ref(false)
const loginLoading = ref<boolean>(false)

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value
}

const auth = useAuthStore();

const form = useForm({
  validationSchema: useLoginSchema(),
});

const onSubmit = form.handleSubmit(async (values) => {
  try {
    loginLoading.value = true
    await auth.login(values)
    loginLoading.value = false
  } catch (error) {
    console.error(error)
  } finally {
    loginLoading.value = false
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
            {{ $t('index.welcome') }}
          </h1>
          <div class="items-center space-x-0 space-y-3 sm:flex sm:space-x-4 sm:space-y-0">
            <a href="#" class="w-full inline-flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-200">
              <div class="flex justify-center">
                <Button type="submit" variant="ghost">
                  <Icon icon="line-md:login" class="mr-1 size-5" />
                  {{ $t('index.loginGoogle') }}
                </Button>
              </div>
            </a>
          </div>
          <div class="flex items-center">
            <div class="w-full h-0.5 bg-gray-200"></div>
            <div class="px-5 text-center text-gray-500">ou</div>
            <div class="w-full h-0.5 bg-gray-200"></div>
          </div>

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
                <FormLabel class="font-semibold">{{ $t('index.password') }}</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input :type="isPasswordVisible ? 'text' : 'password'" variant="outlined" v-bind="componentField" class="pr-10"/>
                    <button type="button" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" @click="togglePasswordVisibility">
                      <Icon v-if="isPasswordVisible" icon="fluent:eye-off-32-filled" class="mr-1 size-5" />
                      <Icon v-else icon="fluent:eye-32-filled" class="mr-1 size-5" />
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Remember -->
          <div>
            <FormField v-slot="{ field }" name="remember">
              <div class="flex justify-between items-center">
                <FormItem class="flex items-center">
                  <div class="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox :checked="field.value" @update:checked="(val) => field.onChange(val)"/>
                      <Label class="text-muted-foreground cursor-pointer" @click="field.onChange(!field.value)">
                        {{ $t('index.remember_me') }}
                      </Label>
                    </FormControl>
                  </div>
                </FormItem>
                <NuxtLink to="/auth/password-reset" class="text-sm font-medium text-gray-500 hover:underline hover:text-primary">
                  {{ $t('index.forgot_password') }}
                </NuxtLink>
              </div>
            </FormField>
          </div>

          <!-- Submit -->
          <div class="flex justify-center">
            <Button type="submit" variant="default" :disabled="loginLoading">
              <Loader2 v-if="loginLoading" class="mr-1 size-5 animate-spin" />
              <Icon v-else icon="line-md:login" class="mr-1 size-5" />
              <Label v-if="!loginLoading" class="cursor-pointer">{{ $t('index.login') }}</Label>
              <Label v-else>{{ $t('index.loading_connexion') }}</Label>
            </Button>
          </div>

          <!-- Register -->
          <p class="text-sm font-light text-gray-500">
            {{ $t('index.no_account') }}
            <NuxtLink to="/auth/register" class="font-medium text-primary-600 hover:underline hover:text-primary">{{ $t('index.signup') }}</NuxtLink>
          </p>
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

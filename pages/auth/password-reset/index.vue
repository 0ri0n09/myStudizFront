<script setup lang="ts">
import { useApiFetch } from "~/composables/useApiFetch";

const form = ref({
  email: "",
})

async function handle() {
  const { data } = await useApiFetch('/auth/password/send', { method: "POST", body: form.value})
}
</script>

<template>
  <form class="space-y-5 dark:text-white bg-amber-500">
    <div>
      <label for="username">email</label>
      <div class="relative text-white">
        <input v-model="form.email" placeholder="enter email" class="w-full rounded-md px-4 py-2 ps-10 placeholder:text-white bg-purple-900" required/>
      </div>
    </div>
    <button @click.prevent="handle" class="px-5 py-3 bg-violet-600 hover:bg-violet-700 rounded-md w-full text-white">
      Sign in
    </button>
  </form>
</template>

<style scoped>

</style>
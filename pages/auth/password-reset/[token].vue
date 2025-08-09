<script setup lang="ts">

import {useApiFetch} from "~/composables/useApiFetch";
const config = useRuntimeConfig()

const token = useRoute().params.token
const form = ref({
  password: "",
  passwordConfirm: "",
  token: token
})

async function handle() {

  if(form.value.password === form.value.passwordConfirm) {
    const {data, error} = await useApiFetch('/auth/password/store/', { method: "POST", body: form.value })
  } else {

  }
}
</script>

<template>
  <form class="space-y-5 dark:text-white bg-amber-500">
    <div>
      <label for="Password">Password</label>
      <div class="relative text-white mb-4">
        <input v-model="form.password" type="password" placeholder="Enter Password" class="w-full rounded-md px-4 py-2 ps-10 placeholder:text-white text-white bg-purple-900" required/>
      </div>
    </div>
    <div>
      <label for="Password-confirm">Confirm Password</label>
      <div class="relative text-white mb-4">
        <input v-model="form.passwordConfirm" type="password" placeholder="Confirm Password" class="w-full rounded-md px-4 py-2 ps-10 placeholder:text-white text-white bg-purple-900" required/>
      </div>
    </div>
    <button @click.prevent="handle" class="px-5 py-3 bg-violet-600 hover:bg-violet-700 rounded-md w-full text-white">
      Change password
    </button>
  </form>
</template>

<style scoped>

</style>
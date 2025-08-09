<template>
  <ConfigProvider :use-id="useIdFunction">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster />
  </ConfigProvider>
</template>
<script setup lang="ts">
  import "~/assets/css/app.css";
  import 'animate.css';
  import { ConfigProvider } from "radix-vue";
  const useIdFunction = () => useId();
</script>

<style>

</style>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

const navigationItems = [
  { path: '/dashboard', icon: 'material-symbols:dashboard' },
  { path: '/folders', icon: 'ph:folders-fill' },
  { path: '/me', icon: 'iconamoon:profile-fill' },
  //{ path: '/settings', icon: 'material-symbols:settings' },
  //{ path: '/test', icon: 'material-symbols:dashboard' }
];
</script>

<template>
  <div>
    <div class="fixed bottom-0 left-0 right-0 bg-gray-50 border z-30 md:hidden">
      <ul class="flex justify-around items-center py-3 px-4 border-t">
        <li v-for="(item, index) in navigationItems" :key="index">
          <NuxtLink :to="item.path" class="flex flex-col items-center">
            <Icon :icon="item.icon" class="size-6 transition-colors" :class="$route.path === item.path ? 'text-primary' : ''"/>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>
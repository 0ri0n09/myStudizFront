<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useSidebar } from '~/composables/useSidebar'
const { isOpen, isCollapsed, closeSidebar, toggleCollapse } = useSidebar();
import { useAuthStore } from "~/stores/useAuthStore";
const auth = useAuthStore();
</script>

<template>
  <div>
    <div v-show="isOpen" class="fixed inset-0 bg-black/50 z-40 md:hidden" @click="closeSidebar"></div>
    <aside class="fixed left-0 top-0 h-screen border-r transition-all duration-300 ease-in-out bg-gray-50 z-40" :class="[isOpen ? 'translate-x-0' : '-translate-x-full', 'md:translate-x-0', isCollapsed ? 'md:w-20' : 'w-52']">
      <Button @click="toggleCollapse" class="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 border shadow-sm hover:bg-primary hover:scale-110 transition-all duration-200 z-50 group">
        <Icon :icon="isCollapsed ? 'material-symbols:chevron-right' : 'material-symbols:chevron-left'" class="size-4 text-gray-600 group-hover:text-white transition-colors duration-200"/>
      </Button>
      <div class="h-full px-3 py-4 overflow-y-auto relative">
        <div class="flex items-center p-4" :class="{ 'justify-center': isCollapsed }">
          <NuxtImg
              class="transition-all duration-300"
              :class="isCollapsed ? 'h-12' : 'w-full'"
              :src="isCollapsed ? '/images/cube.svg' : '/images/logo.svg'"
              alt="myStudiz"
          />
        </div>
        <ul class="mt-12 space-y-2">
          <li v-if="auth.isAdmin && auth.isLoggedIn">
            <NuxtLink href="/stats" class="flex items-center rounded-lg hover:bg-primary transition-colors p-2 group" :class="{ 'justify-center': isCollapsed, 'bg-primary text-white': $route.path === '/stats' }" @click="closeSidebar">
              <Icon icon="material-symbols:dashboard" class="size-6 group-hover:text-white transition-colors" :class="isCollapsed ? '' : 'mr-3'"/>
              <Label v-if="!isCollapsed" class="cursor-pointer text-md group-hover:text-white transition-colors">Stats</Label>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink href="/dashboard" class="flex items-center rounded-lg hover:bg-primary transition-colors p-2 group" :class="{ 'justify-center': isCollapsed, 'bg-primary text-white': $route.path === '/dashboard' }" @click="closeSidebar">
              <Icon icon="material-symbols:dashboard" class="size-6 group-hover:text-white transition-colors" :class="isCollapsed ? '' : 'mr-3'"/>
              <Label v-if="!isCollapsed" class="cursor-pointer text-md group-hover:text-white transition-colors">{{ $t('sidebar.dashboard') }}</Label>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink href="/folders" class="flex items-center rounded-lg hover:bg-primary transition-colors p-2 group" :class="{ 'justify-center': isCollapsed, 'bg-primary text-white': $route.path === '/folders' }" @click="closeSidebar">
              <Icon icon="ph:folders-fill" class="size-6 group-hover:text-white transition-colors" :class="isCollapsed ? '' : 'mr-3'"/>
              <Label v-if="!isCollapsed" class="cursor-pointer text-md group-hover:text-white transition-colors">{{ $t('sidebar.folders') }}</Label>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink href="/me" class="flex items-center rounded-lg hover:bg-primary transition-colors p-2 group" :class="{ 'justify-center': isCollapsed, 'bg-primary text-white': $route.path === '/me' }" @click="closeSidebar">
              <Icon icon="iconamoon:profile-fill" class="size-6 group-hover:text-white transition-colors" :class="isCollapsed ? '' : 'mr-3'"/>
              <Label v-if="!isCollapsed" class="cursor-pointer text-md group-hover:text-white transition-colors">{{ $t('sidebar.me') }}</Label>
            </NuxtLink>
          </li>
          <li class="hidden">
            <NuxtLink href="/settings" class="flex items-center rounded-lg hover:bg-primary transition-colors p-2 group" :class="{ 'justify-center': isCollapsed, 'bg-primary text-white': $route.path === '/settings' }" @click="closeSidebar">
              <Icon icon="material-symbols:settings" class="size-6 group-hover:text-white transition-colors" :class="isCollapsed ? '' : 'mr-3'"/>
              <Label v-if="!isCollapsed" class="cursor-pointer text-md group-hover:text-white transition-colors">{{ $t('sidebar.settings') }}</Label>
            </NuxtLink>
          </li>
          <li class="hidden">
            <NuxtLink href="/test" class="flex items-center rounded-lg hover:bg-primary transition-colors p-2 group" :class="{ 'justify-center': isCollapsed, 'bg-primary text-white': $route.path === '/test' }" @click="closeSidebar">
              <Icon icon="material-symbols:dashboard" class="size-6 group-hover:text-white transition-colors" :class="isCollapsed ? '' : 'mr-3'"/>
              <Label v-if="!isCollapsed" class="cursor-pointer text-md group-hover:text-white transition-colors">Test</Label>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<style scoped>

</style>
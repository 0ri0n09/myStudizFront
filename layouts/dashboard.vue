<script setup lang="ts">
import type { UUID } from "node:crypto";
import Sidebar from "~/components/Sidebar.vue";
import { useSidebar } from '~/composables/useSidebar'
const { isCollapsed } = useSidebar();

//Flashcards
const isFlashcardDeleteOpen = ref(false)
provide('isFlashcardDeleteOpen', isFlashcardDeleteOpen)
const flashcardIdToDelete = ref<UUID | null>(null)
provide('flashcardIdToDelete', flashcardIdToDelete)
</script>

<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <div class="flex flex-col flex-1 transition-all duration-300" :class="['ml-0 md:ml-20', { 'md:ml-52': !isCollapsed }]">
      <Navbar class="bg-gray-50 sticky top-0 w-full h-16 z-30 shadow-md" />
      <main class="p-2 min-h-screen overflow-x-hidden min-w-0">
        <slot />
      </main>
      <Footer />
    </div>
  </div>
</template>
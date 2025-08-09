<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useAuthStore } from "~/stores/useAuthStore";
const { logout } = useAuthStore();
import { useSidebar } from '~/composables/useSidebar'
const { toggleSidebar } = useSidebar();

const handleLogout = async () => {
  await logout();
};
</script>

<template>
  <nav class="bg-gray-50 sticky top-0 w-full h-16 z-30 shadow-md mb-3">
    <div class="flex items-center justify-between h-16 px-3 md:px-7">
      <div class="flex items-center md:hidden">
        <button class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary border" @click="toggleSidebar">
          <Icon icon="heroicons:bars-3" class="size-6" />
        </button>
      </div>
      <div class="flex items-center ml-auto space-x-3">
        <NuxtLink href="/me">
          <Avatar>
            <AvatarImage src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="@radix-vue" />
            <AvatarFallback>MS</AvatarFallback>
          </Avatar>
        </NuxtLink>
        <LangSwitcher />
        <Button type="button" variant="destructive" @click="handleLogout">
          <Icon icon="line-md:logout" class="size-5"/>
          <Label class="hidden cursor-pointer">{{ $t('dashboard.logout') }}</Label>
        </Button>
      </div>
    </div>
  </nav>
</template>
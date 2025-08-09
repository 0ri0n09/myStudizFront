<script setup lang="ts">
import { CheckIcon, ChevronDownIcon } from 'lucide-vue-next'
import { Icon } from "@iconify/vue";

useHead({ title: "myStudiz - Dashboard" });
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>

<template>
  <div class="md:mx-4" :class="useMobile().isMobile ? 'mb-10' : ''">
    <div class="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 min-h-screen">
      <!-- Section Activités -->
      <Card>
        <CardHeader>
          <CardTitle>Activités</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex h-40 items-end space-x-2">
            <div v-for="(height, i) in [40, 60, 80, 100, 90, 70, 60]" :key="i"
                 class="bg-primary w-6" :style="{ height: height + 'px' }"></div>
          </div>
          <div class="flex justify-between text-xs mt-2 text-gray-600">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mer</span>
            <span>Jeu</span>
            <span>Ven</span>
            <span>Sam</span>
            <span>Dim</span>
          </div>
        </CardContent>
      </Card>

      <!-- Section Défis -->
      <Card>
        <CardHeader>
          <CardTitle class="flex justify-between">
            <span>Défis</span>
            <Badge variant="secondary" class="bg-red-100 text-primary rounded-full">2</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div v-for="(item, i) in ['Créer un dossier', 'Créer une flashcard', 'Créer un QCM']" :key="i"
               class="flex items-center space-x-2">
            <div class="w-5 h-5 rounded-full flex items-center justify-center"
                 :class="[i === 0 || i === 2 ? 'bg-red-500' : 'border-2 border-gray-300']">
              <CheckIcon v-if="i === 0 || i === 2" class="h-3 w-3 text-white" />
            </div>
            <span class="text-sm">{{ item }}</span>
          </div>
        </CardContent>
      </Card>

      <!-- Section Calendrier -->
      <Card>
        <CardHeader>
          <CardTitle class="flex justify-between">
            <span>Calendrier</span>
            <div class="flex items-center space-x-2">
              <span class="text-sm">Semaine</span>
              <ChevronDownIcon class="h-4 w-4" />
              <Badge variant="secondary" class="bg-red-100 text-primary rounded-full">2</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-7 text-center text-sm mb-2">
            <div>L</div>
            <div>M</div>
            <div>M</div>
            <div>J</div>
            <div>V</div>
            <div>S</div>
            <div>D</div>
          </div>
          <div class="relative h-60">
            <!-- Blocs de calendrier -->
            <div class="absolute bg-blue-600 text-white p-2 rounded-md left-[14%] top-[5%] w-[12%] h-[20%] flex items-center justify-center">
              M
            </div>
            <div class="absolute bg-primary text-white p-2 rounded-md left-[42%] top-[30%] w-[12%] h-[20%] flex items-center justify-center">
              H
            </div>
            <div class="absolute bg-orange-400 text-white p-2 rounded-md left-[70%] top-[20%] w-[12%] h-[50%] flex items-center justify-center">
              F
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Section Tâches -->
      <Card class="md:col-span-2">
        <CardHeader>
          <CardTitle>Tâches</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div v-for="(task, i) in ['Relire les notes', 'Finir le mémoire', 'Écrire une nouvelle tâche']" :key="i"
               class="flex items-center space-x-2">
            <div class="w-5 h-5 rounded-full border-2">
            </div>
            <span class="text-sm" :class="i === 2 ? 'text-gray-400' : ''">{{ task }}</span>
          </div>

          <div class="flex justify-end">
            <Button>
              <Icon icon="line-md:plus-circle" class="size-5 mr-2" />
              <p>Ajouter une tâche</p>
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Section Réviser -->
      <Card class="md:col-span-3">
        <CardHeader>
          <CardTitle>Réviser</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid md:grid-cols-3 gap-6">
            <div v-for="(item, i) in [
            { title: 'Créer une flashcard', icon: 'cards' },
            { title: 'Créer une note', icon: 'document' },
            { title: 'Créer un dossier', icon: 'folder' }
          ]" :key="i" class="flex flex-col items-center border rounded-md">
              <div class="text-primary mb-4 ">
                <div v-if="item.icon === 'cards'" class="relative">
                  <Icon icon="arcticons:flashcards" class="size-16" />
                </div>
                <div v-if="item.icon === 'document'">
                  <Icon icon="ic:twotone-notes" class="size-16" />
                </div>
                <div v-if="item.icon === 'folder'">
                  <Icon icon="line-md:folder-twotone" class="size-16" />
                  <div class="flex-1"></div>
                </div>
              </div>
              <h3 class="font-medium text-base mb-2">{{ item.title }}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { type Flashcard, FlashcardType } from "~/types/flashcard";

defineProps<{
  flashcard: Flashcard
}>()
</script>

<template>
  <Card>
    <CardContent class="p-2">
      <!-- Question -->
      <p class="text-md text-center font-bold">{{ flashcard.question }}</p>

      <Separator class="my-2" />

      <!-- Réponses -->
      <p v-if="flashcard.type === FlashcardType.SINGLE" class="text-sm text-muted-foreground">
        {{ flashcard.answers.answer }}
      </p>
      <ul v-else class="space-y-1 text-sm">
        <li
            v-for="(option, index) in flashcard.answers.options"
            :key="index"
            :class="[
            'px-3 py-1 rounded-md',
            option.isCorrect ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
          ]"
        >
          {{ option.answer }}
        </li>
      </ul>
    </CardContent>
  </Card>
</template>
<script setup lang="ts">
import { Icon } from "@iconify/vue"

const languageIcons = {
  fr: 'twemoji:flag-france',
  en: 'twemoji:flag-us-outlying-islands',
}

const { locale, locales, setLocale, setLocaleCookie } = useI18n()
const lang = ref(locale.value)

const handleLanguageSwitch = (code: string) => {
  lang.value = code;
  setLocale(lang.value);
  setLocaleCookie(lang.value);
}

const availableLocales = computed(() => {
  return locales.value
})
</script>

<template>
  <Select :defaultValue="locale">
    <SelectTrigger class="w-min bg-gray-50">
      <span class="flex items-center gap-1">
        <Icon class="mr-1 size-5" :icon="languageIcons[locale]" />
      </span>
    </SelectTrigger>
    <SelectContent>
      <SelectItem
          class="cursor-pointer"
          v-for="(itemLocale, index) in availableLocales"
          :key="index"
          :id="itemLocale.code"
          :value="itemLocale.code"
          @touchstart.passive="handleLanguageSwitch(itemLocale.code)"
          @mousedown.prevent="handleLanguageSwitch(itemLocale.code)"
      >
        <div class="flex items-center justify-between w-full cursor-pointer">
          <div class="flex items-center gap-2">
            <Icon :icon="languageIcons[itemLocale.code]" class="size-5" />
            <Select>{{ itemLocale.name }}</Select>
          </div>
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
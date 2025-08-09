<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<template>
  <Select>
    <SelectTrigger>
      <SelectValue :placeholder="$t('register.select_gender')" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="MALE">
        <div class="flex items-center gap-2">
          <Icon icon="foundation:male" class="size-7" />
          <Label>{{ $t('register.male') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="FEMALE">
        <div class="flex items-center gap-2">
          <Icon icon="foundation:female" class="size-7" />
          <Label>{{ $t('register.female') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="UNKNOWN">
        <div class="flex items-center gap-2">
          <Icon icon="oui:token-null" class="size-7" />
          <Label>{{ $t('register.unknown') }}</Label>
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
</template>

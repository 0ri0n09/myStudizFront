<script setup>
import { Icon } from "@iconify/vue";
</script>

<template>
  <Select>
    <SelectTrigger>
      <SelectValue :placeholder="$t('register.select_country')" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="France">
        <div class="flex items-center gap-2">
          <Icon icon="twemoji:flag-france" class="size-5" />
          <Label>{{ $t('country.france') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="Germany">
        <div class="flex items-center gap-2">
          <Icon icon="twemoji:flag-germany" class="size-5" />
          <Label>{{ $t('country.germany') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="Italy">
        <div class="flex items-center gap-2">
          <Icon icon="twemoji:flag-italy" class="size-5" />
          <Label>{{ $t('country.italy') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="Spain">
        <div class="flex items-center gap-2">
          <Icon icon="twemoji:flag-spain" class="size-5" />
          <Label>{{ $t('country.spain') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="United States">
        <div class="flex items-center gap-2">
          <Icon icon="twemoji:flag-united-states" class="size-5" />
          <Label>{{ $t('country.united_states') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="Canada">
        <div class="flex items-center gap-2">
          <Icon icon="twemoji:flag-canada" class="size-5" />
          <Label>{{ $t('country.canada') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="Brazil">
        <div class="flex items-center gap-2">
          <Icon icon="twemoji:flag-brazil" class="size-5" />
          <Label>{{ $t('country.brazil') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="Australia">
        <div class="flex items-center gap-2">
          <Icon icon="twemoji:flag-australia" class="size-5" />
          <Label>{{ $t('country.australia') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="Japan">
        <div class="flex items-center gap-2">
          <Icon icon="twemoji:flag-japan" class="size-5" />
          <Label>{{ $t('country.japan') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="China">
        <div class="flex items-center gap-2">
          <Icon icon="twemoji:flag-china" class="size-5" />
          <Label>{{ $t('country.china') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="India">
        <div class="flex items-center gap-2">
          <Icon icon="twemoji:flag-india" class="size-5" />
          <Label>{{ $t('country.india') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="South Africa">
        <div class="flex items-center gap-2">
          <Icon icon="twemoji:flag-south-africa" class="size-5" />
          <Label>{{ $t('country.south_africa') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="Russia">
        <div class="flex items-center gap-2">
          <Icon icon="twemoji:flag-russia" class="size-5" />
          <Label>{{ $t('country.russia') }}</Label>
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
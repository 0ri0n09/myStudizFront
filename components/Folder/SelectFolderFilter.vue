<script setup>
import { Icon } from "@iconify/vue";
</script>

<template>
  <Select disabled>
    <SelectTrigger>
      <SelectValue :placeholder="$t('folders.filter_folder_placeholder')" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="none">
        <div class="flex items-center gap-2">
          <Icon icon="mi:filter" class="size-5" />
          <Label>{{ $t('folders.filter_folder_none') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="recent">
        <div class="flex items-center gap-2">
          <Icon icon="mi:filter" class="size-5" />
          <Label>{{ $t('folders.filter_folder_recent') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="old">
        <div class="flex items-center gap-2">
          <Icon icon="mi:filter" class="size-5" />
          <Label>{{ $t('folders.filter_folder_old') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="public">
        <div class="flex items-center gap-2">
          <Icon icon="mi:filter" class="size-5" />
          <Label>{{ $t('folders.filter_folder_public') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="private">
        <div class="flex items-center gap-2">
          <Icon icon="mi:filter" class="size-5" />
          <Label>{{ $t('folders.filter_folder_private') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="name">
        <div class="flex items-center gap-2">
          <Icon icon="mi:filter" class="size-5" />
          <Label>{{ $t('folders.filter_folder_name') }}</Label>
        </div>
      </SelectItem>
      <SelectItem value="color">
        <div class="flex items-center gap-2">
          <Icon icon="mi:filter" class="size-5" />
          <Label>{{ $t('folders.filter_folder_color') }}</Label>
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
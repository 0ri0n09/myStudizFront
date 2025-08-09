<script setup lang="ts">
import type { WithClassAsProps } from './interface'
import { cn } from '@/lib/utils'
import { useCarousel } from './useCarousel'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<WithClassAsProps>()

const { carouselRef, orientation } = useCarousel()
</script>

<template>
  <div ref="carouselRef" class="overflow-hidden">
    <div
      :class="
        cn(
          'flex',
          orientation === 'horizontal' ? '-ml-2 p-2' : '-mt-2 flex-col',
          props.class,
        )"
      v-bind="$attrs"
    >
      <slot />
    </div>
  </div>
</template>

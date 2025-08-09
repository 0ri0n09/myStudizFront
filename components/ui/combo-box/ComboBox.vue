<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'

interface Option {
  label: string
  value: string
}

const props = defineProps<{
  options: Option[]
  name: string
  label: string
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  description?: string
  modelValue?: string
}>()
const emit = defineEmits(['update:modelValue'])

const selectedValue = computed(() => {
  return props.options.find(option => option.value === props.modelValue)?.label || ''
})

const handleSelect = (value) => {
  emit('update:modelValue', value);
}
</script>

<template>
  <div>
    <FormField :name="name">
      <FormItem class="flex flex-col">
        <FormLabel>{{ label }}</FormLabel>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl>
              <Button variant="outline" role="combobox">
                {{ modelValue ? selectedValue : placeholder || 'Select option...' }}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="w-[230px] p-0">
            <Command>
              <CommandInput :placeholder="searchPlaceholder || 'Search...'"/>
              <CommandEmpty>{{ emptyMessage || 'Nothing found.' }}</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                      v-for="option in options"
                      :key="option.value"
                      :value="option.label"
                      @select="() => handleSelect(option.value)"
                      class= "cursor-pointer"
                  >
                    {{ option.label }}
                    <Check v-if="option.value === modelValue" class="ml-2 h-5 w-5 text-primary" />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <FormDescription v-if="description">
          {{ description }}
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</template>

<style scoped>

</style>
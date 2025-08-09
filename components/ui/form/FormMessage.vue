<script lang="ts" setup>
import { ErrorMessage } from 'vee-validate'
import { toValue } from 'vue'
import { useFormField } from './useFormField'

const { name, formMessageId } = useFormField()
</script>

<template>
  <div v-auto-animate>
    <ErrorMessage
        :id="formMessageId"
        as="p"
        :name="toValue(name)"
        class="text-sm font-medium text-destructive"
    />
  </div>
</template>

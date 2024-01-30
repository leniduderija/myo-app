<script setup lang="ts">
import type { ValidateInfo } from 'ant-design-vue/es/form/useForm'

defineProps<{
  modelValue: string
  name: string
  placeholder: string
  label: string
  type: string
  validateInfo: ValidateInfo
  disabled?: boolean
}>()

defineEmits<{
  (e: 'update', value: string): void
}>()
</script>

<template>
  <a-form-item :label="label" v-bind="validateInfo">
    <a-input
      :type="type"
      :value="modelValue"
      :name="name"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :bordered="!disabled"
      :disabled="disabled"
    />
  </a-form-item>
</template>

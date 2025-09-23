<template>
  <div :class="disabled ? '' : 'hover:bg-primary-300'" class="my-2 inline-flex relative text-4xl font-bold transition duration-200 rounded-sm justify-center">
    <div class="inline-flex relative overflow-hidden min-w-4 px-5 py-5 opacity-0 whitespace-pre before:content-[''] empty:before:content-[attr(data-placeholder)]" :data-placeholder="placeholder">{{ modelValue }}</div>
    <input type="text" class="absolute top-0 left-0 box-border w-full px-5 py-4 focus:outline-none underline decoration-transparent underline-offset-4 decoration-2 focus-visible:decoration-slate-200 transition-[text-decoration-color] duration-200 whitespace-pre" @input="onInput" :disabled="disabled" :placeholder="placeholder" :value="modelValue" />
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core';

const props = withDefaults(defineProps<InputProps<string>>(), {
  modelValue: '',
  defaultValue: '',
  disabled: false
})

const emits = defineEmits<InputEmits>()

interface InputEmits {
  'update:modelValue': [payload: string]
  'focus': [payload: FocusEvent]
  'onInput': [payload: void]
}

interface InputProps<T> {
  modelValue: T
  defaultValue?: T
  disabled?: boolean
  placeholder?: string
}

const modelValue = useVModel<InputProps<string>, 'modelValue', 'update:modelValue'>(props, 'modelValue', emits, { defaultValue: props.defaultValue })

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;

  modelValue.value = value;
  emits('onInput')
}
</script>

<style scoped>
</style>

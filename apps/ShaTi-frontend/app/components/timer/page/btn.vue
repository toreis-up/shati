<template>
  <UButton color="primary" class="font-bold" size="lg" :variant="outlined ? 'outline': 'solid'" @click="onClick" :disabled="disabled">
    <slot />
  </UButton>
</template>

<script setup lang="ts">
const emit = defineEmits(['onClick']);

function onClick() {
  emit('onClick');
}

const { outlined, disabled } = defineProps({
  outlined: {
    type: Boolean,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

</script>

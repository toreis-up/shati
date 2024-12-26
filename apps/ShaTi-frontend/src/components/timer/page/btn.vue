<template>
  <button :class="btn" @click="onClick" :disabled="disabled">
    <slot />
  </button>
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

const btn = computed(() => {
  let str = '';
  if (outlined) {
    str =
      'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded';
    if (disabled) {
      str += " hover:bg-gray-500 text-gray-700 border-gray-500"
    }
  } else {
    str =
      'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';
  }

  return str;
});
</script>

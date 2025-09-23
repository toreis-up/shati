<template>
  <div class="flex justify-center space-x-5">
    <UButton v-if="!isRunning" icon="mdi-play" color="success" @click="$emit('onStart')" />
    <UButton v-if="isRunning" icon="mdi-stop" color="error" @click="$emit('onStop')" />
    <UButton :disabled="!isRunning" v-if="!paused" icon="mdi-pause-circle" color="warning" @click="$emit('onPause')" />
    <UButton v-if="paused" icon="mdi-play-circle" color="success" @click="$emit('onResume')" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isRunning: {
    type: Boolean,
    required: true,
  },
  paused: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'onStart'): void;
  (e: 'onPause'): void;
  (e: 'onStop'): void;
  (e: 'onResume'): void;
}>();

</script>

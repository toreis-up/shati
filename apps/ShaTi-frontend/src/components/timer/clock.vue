<template>
  <div class="font-bold" :class="big ? 'text-8xl' : 'text-4xl'">
    {{ durationStr }}
  </div>
</template>

<script setup lang="ts">
import type { Duration } from '@shati/types';
import type { PropType } from 'vue';

const { duration } = defineProps({
  duration: {
    type: Object as PropType<Duration>,
    default: () => ({
      minutes: undefined,
      seconds: undefined,
    }),
  },
  big: {
    type: Boolean,
    default: false,
  },
});

const durationStr = computed(() => {
  return `${minutesStr.value} : ${secondsStr.value}`;
});

const minutesStr = computed(() => {
  return duration.minutes?.toString().padStart(2, '0') || '--';
});

const secondsStr = computed(() => {
  return duration.seconds?.toString().padStart(2, '0') || '--';
});
</script>

<template>
  <div class="font-bold max-md:text-7xl text-9xl" :class="classStr">
    {{ durationStr }}
  </div>
</template>

<script setup lang="ts">
import type { Duration } from '@shati/types';
import type { PropType } from 'vue';

const { past, duration, class: bindClass } = defineProps({
  duration: {
    type: Object as PropType<Duration>,
    default: () => ({
      minutes: undefined,
      seconds: undefined,
    }),
  },
  class: {
    type: String,
    required: false,
  },
  past: {
    type: Boolean,
    default: false,
  }
});

const classStr = computed(() => {
  let str = '';
  str += bindClass;
  return str;
});

const durationStr = computed(() => {
  return `${minutesStr.value} : ${secondsStr.value}`;
});

const minutesStr = computed(() => {
  if (duration.minutes === 0 && past) {
    return '-0'
  }
  return duration.minutes?.toString().padStart(2, '0') || '--';
});

const secondsStr = computed(() => {
  return duration.seconds?.toString().padStart(2, '0') || '--';
});
</script>

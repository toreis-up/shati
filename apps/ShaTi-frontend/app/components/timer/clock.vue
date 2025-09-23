<template>
  <div :class="props.big ? 'text-8xl' : 'text-4xl'">
    <div class="flex font-bold justify-center items-center">
      <div class="my-5 mx-3 flex flex-col items-center">
        <UButton
          class="mb-4"
          :disabled="disabled"
          icon="mdi-plus"
          @click="addMinute(1)"
        ></UButton>

        <div class="mb-4">{{ minutesStr }}</div>

        <UButton
          class="mt-4"
          :disabled="disabled"
          icon="mdi-minus"
          @click="addMinute(-1)"
        ></UButton>
      </div>

      <div class="mx-3">
        <div class="mb-4">:</div>
      </div>

      <div class="my-5 mx-3 flex flex-col items-center">
        <UButton
          class="mb-4"
          :disabled="disabled"
          icon="mdi-plus"
          @click="addSecond(1)"
        ></UButton>
        <div class="mb-4">{{ secondsStr }}</div>
        <UButton
          class="mt-4"
          :disabled="disabled"
          icon="mdi-minus"
          @click="addSecond(-1)"
        ></UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Duration } from '@shati/types';

const duration = defineModel<Duration>('duration', { required: true });

const props = defineProps({
  big: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['onEdit']);

const minutesStr = computed(() => {
  return duration.value.minutes?.toString().padStart(2, '0') || '--';
});

const addMinute = (delta: number) => {
  if (!duration.value.minutes) {
    duration.value.minutes = 0;
  }
  if (duration.value.minutes + delta < 0) {
    return;
  }
  duration.value.minutes += delta;
  emits('onEdit');
};

const secondsStr = computed(() => {
  return duration.value.seconds?.toString().padStart(2, '0') || '--';
});

const addSecond = (delta: number) => {
  if (!duration.value.seconds) {
    duration.value.seconds = 0;
  }
  if (duration.value.seconds + delta < 0) {
    if (duration.value.minutes && duration.value.minutes > 0) {
      duration.value.minutes -= 1;
      duration.value.seconds = 59;
    }
    emits('onEdit');
    return;
  }
  if (duration.value.seconds + delta > 59) {
    duration.value.minutes += 1;
    duration.value.seconds = 0;
    emits('onEdit');
    return;
  }
  duration.value.seconds += delta;
  emits('onEdit');
};
</script>

<template>
  <NuxtLink
    :to="'/timer/' + timer.id"
    class="block relative rounded-lg px-3 py-1 flex-col xl:col-span-2 sm:col-span-4 col-span-6"
    :class="
      timer.isRunning
        ? 'bg-(--ui-bg-elevated)'
        : 'bg-(--ui-success-200) text-(--ui-success-800)'
    "
  >
    <div class="flex flex-col">
      <TimerTitle
        :title="timer.name"
        :background-class="
          timer.isRunning
            ? 'bg-(--ui-bg-elevated)'
            : 'bg-(--ui-success-200)'
        "
      />
      <TimerClock :duration="timer.duration" />
      <div
        class="absolute bottom-0 right-0 w-12 h-4/5"
        :class="
          timer.isRunning
            ? 'bg-(--ui-primary-300)'
            : 'bg-(--ui-success-300)'
        "
        style="clip-path: polygon(100% 0, 100% 100%, 0 100%)"
      ></div>
      <div class="absolute bottom-0 right-0 p-1">
        <UIcon
          class="w-5 h-5"
          :name="
            timer.isRunning
              ? 'i-mdi-clock-outline'
              : 'i-mdi-check-circle-outline'
          "
        />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Timer } from '@shati/types';

const { timer } = defineProps({
  timer: {
    type: Object as PropType<Timer>,
    default: () => ({}),
  },
});
</script>

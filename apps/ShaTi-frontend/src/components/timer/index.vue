<template>
  <NuxtLink
    :to="'/timer/' + timer.id"
    class="block relative rounded-lg px-3 py-1 flex-col xl:col-span-2 sm:col-span-4 col-span-6"
    :class="timer.isRunning ? 'bg-sky-200 text-blue-800': 'bg-lime-200 text-green-800'"
  >
    <div class="flex flex-col">
      <TimerTitle :title="timer.name" :background-class="timer.isRunning ? 'bg-sky-200':'bg-lime-200'" />
      <TimerClock :duration="timer.duration" />
      <div
      class="absolute bottom-0 right-0 w-12 h-4/5"
      :class="timer.isRunning ? 'bg-sky-800' : 'bg-inherit'"
      style="clip-path: polygon(100% 0, 100% 100%, 0 100%);">
      </div>
      <div class="absolute bottom-0 right-0 p-1"
      :class="timer.isRunning ? 'text-white' : 'text-sky-800'">
        <span class=" w-5 h-5" :class="timer.isRunning ? 'i-mdi-clock' : 'i-mdi-check-circle-outline'" />
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

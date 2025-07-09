<template>
  <div class="grid grid-cols-12 gap-4 p-5 pointer-events-auto">
    <Timer v-for="timer in timers" :key="timer.id" :timer="timer" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const timerListStore = useTimerListStore();
const { timers } = storeToRefs(timerListStore);
const { fetchTimers } = timerListStore;

await useAsyncData(() => fetchTimers());

</script>

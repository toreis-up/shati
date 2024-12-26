<template>
  <ClientOnly>
    <div class="grid grid-cols-12 gap-4 p-5 pointer-events-auto">
      <Timer v-for="timer in timers" :timer="timer" :key="timer.id" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useTimerListStore } from '../../store/useTimerListStore';

const { timers, fetchTimers } = useTimerListStore();

await useAsyncData('timerList', () => fetchTimers());
</script>

<style>
</style>

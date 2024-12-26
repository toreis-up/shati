import { defineStore } from 'pinia';
import type { Timer, TimerOutputList } from '@shati/types';

type TimerListResponse = {
  timers: TimerOutputList;
};

export const useTimerListStore = defineStore('timerlist', () => {
  const timers = ref<Timer[]>([]);

  async function fetchTimers() {
    const timerResponse = await $fetch<TimerListResponse>(
      `http://localhost:8787/timer`
    );
    timers.value = timerResponse.timers;

    return timers.value
  }

  return { timers, fetchTimers };
});

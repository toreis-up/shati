<template>
  <div class="grid justify-center content-center h-screen">
    <TimerTitle :title="timer.name" auto-scroll />
    <TimerPageClock class="justify-self-center" :duration="timer.isRunning ? timer.isPausing ? timer.remainDuration : timerRemain : timer.duration" />
    <div class="flex justify-around pt-5">
      <TimerPageBtn @on-click="timer.isRunning ? onStop() : onStart()">{{ timer.isRunning ? 'Stop' : 'Start' }}</TimerPageBtn>
      <TimerPageBtn @on-click="timer.isPausing ? onResume() : onPause()" :disabled="!timer.isRunning" outlined>{{ timer.isPausing ? 'Resume' : 'Pause' }}</TimerPageBtn>
    </div>
    <div class="flex h-screen absolute justify-self-end self-end items-end">
      <!-- なんかいい感じにしたい -->
      <!-- <TimerPageClock :duration="timer.duration" :class="'text-opacity-10'"></TimerPageClock> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['onStart', 'onStop', 'onPause', 'onResume'])
import type { Timer } from '@shati/types';

import {ref} from 'vue'

const now = ref(0)

const timerRemain = computed(() => {
  return {
    minutes: Math.floor((timer.endAt - now.value) / 60),
    seconds: Math.abs((timer.endAt - now.value) % 60)
  }
})

const refreshNow = () => {
  now.value = Math.floor(Date.now() / 1000)
  setTimeout(refreshNow, 1000)
}

const onStop = () => {
  emits('onStop')
}
const onStart = () => {
  emits('onStart')
}
const onPause = () => {
  emits('onPause')
}

const onResume = () => {
  emits('onResume')
}

const { timer } = defineProps({
  timer: {
    type: Object as PropType<Timer>,
    default: () => ({}),
  },
});

refreshNow()
</script>

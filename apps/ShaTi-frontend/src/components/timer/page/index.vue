<template>
  <div class="grid justify-center content-center h-screen">
    <TimerTitle :title="timer.name" auto-scroll />
    <TimerPageClock class="justify-self-center" :past="timer.endAt - now < 0" :duration="timer.isRunning ? timerRemain : timer.duration" />
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
import alarmUrl from '~/assets/alarm.mp3'

import {ref} from 'vue'

const now = ref(0)
const audio = ref<HTMLAudioElement | undefined>(undefined)

const timerRemain = computed(() => {
  if (timer.isPausing) {
    return {
      minutes: timer.remainDuration.minutes,
      seconds: Math.abs(timer.remainDuration?.seconds)
    }
  }
  return {
    minutes: (timer.endAt - now.value) < 0 ? Math.ceil((timer.endAt - now.value)  / 60) : Math.floor((timer.endAt - now.value)  / 60),
    seconds: Math.abs((timer.endAt - now.value) % 60)
  }
})

const triggerAlarm = () => {
  audio.value = new Audio(alarmUrl)
  audio.value!.play();
}

watch(timerRemain, (newTimer, oldTimer) => {
  if (newTimer.minutes * 60 + newTimer.seconds === 0) {
    triggerAlarm();
  }
})

const refreshNow = () => {
  now.value = Math.floor(Date.now() / 1000)
  setTimeout(refreshNow, 1000)
}

const onStop = () => {
  if (audio.value){
    audio.value.pause();
    audio.value.currentTime = 0;
  }
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

<template>
  <div class="grid justify-center content-center h-screen">
    <TimerTitle :title="timer.name" auto-scroll />
    <TimerPageClock class="justify-self-center" :past="timer.endAt - now < 0" :duration="timer.isRunning ? timerRemain : timer.duration" />
    <div class="flex justify-around pt-5" v-if="!viewonly">
      <TimerPageBtn @on-click="timer.isRunning ? onStop() : onStart()">{{ timer.isRunning ? 'Stop' : 'Start' }}</TimerPageBtn>
      <TimerPageBtn @on-click="timer.isPausing ? onResume() : onPause()" :disabled="!timer.isRunning" color="tartiary" outlined>{{ timer.isPausing ? 'Resume' : 'Pause' }}</TimerPageBtn>
    </div>
    <div class="flex h-screen absolute justify-self-end self-end items-end">
      <!-- なんかいい感じにしたい -->
      <!-- <TimerPageClock :duration="timer.duration" :class="'text-opacity-10'"></TimerPageClock> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Timer } from '@shati/types';
import { ref, computed, watch, onMounted, onUnmounted, type PropType } from 'vue'

const alarmUrl = '/audio/alarm.mp3'
const preAlarmUrl = '/audio/pre-alarm.mp3'

const emits = defineEmits(['onStart', 'onStop', 'onPause', 'onResume'])

const now = ref(0)
const alarmSound = ref<HTMLAudioElement | undefined>(undefined)
const preAlarmSound = ref<HTMLAudioElement | undefined>(undefined)
let rafId: number | null = null;
let preAlarmTriggered = false;
let alarmTriggered = false;

const timerRemain = computed(() => {
  if (timer.isPausing) {
    return {
      minutes: timer.remainDuration.minutes,
      seconds: Math.abs(timer.remainDuration?.seconds)
    }
  }
  const remainingSeconds = timer.endAt - now.value;
  return {
    minutes: remainingSeconds < 0 ? Math.ceil(remainingSeconds / 60) : Math.floor(remainingSeconds / 60),
    seconds: Math.abs(remainingSeconds % 60)
  }
})

const tick = () => {
  now.value = Math.floor(Date.now() / 1000);
  const remainingSeconds = timer.endAt - now.value;

  if (timer.isRunning && !timer.isPausing) {
    // Pre-alarm check
    if (remainingSeconds <= 60 && !preAlarmTriggered) {
      preAlarmSound.value?.play();
      preAlarmTriggered = true;
    }

    // Final alarm check
    if (remainingSeconds <= 0 && !alarmTriggered) {
      alarmSound.value?.play();
      alarmTriggered = true;
    }
  }

  rafId = requestAnimationFrame(tick);
}

onMounted(() => {
  alarmSound.value = new Audio(alarmUrl)
  alarmSound.value.load()
  preAlarmSound.value = new Audio(preAlarmUrl)
  preAlarmSound.value.load()
  tick()
})

onUnmounted(() => {
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
})

const onStop = () => {
  alarmSound.value?.pause()
  if (alarmSound.value) alarmSound.value.currentTime = 0
  preAlarmSound.value?.pause()
  if (preAlarmSound.value) preAlarmSound.value.currentTime = 0
  // Reset alarm flags
  preAlarmTriggered = false;
  alarmTriggered = false;
  emits('onStop')
}
const onStart = () => {
  // Reset alarm flags
  preAlarmTriggered = false;
  alarmTriggered = false;
  emits('onStart')
}
const onPause = () => {
  emits('onPause')
}

const onResume = () => {
  emits('onResume')
}

const { timer, viewonly } = defineProps({
  timer: {
    type: Object as PropType<Timer>,
    default: () => ({}),
  },
  viewonly: {
    type: Boolean,
    default: false
  }
});
</script>

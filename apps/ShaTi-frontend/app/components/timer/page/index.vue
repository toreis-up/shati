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
import { storeToRefs } from 'pinia';

const alarmUrl = '/audio/alarm.mp3'
const preAlarmUrl = '/audio/pre-alarm.mp3'

const emits = defineEmits(['onStart', 'onStop', 'onPause', 'onResume'])

const timerStore = useTimerStore();
const { timeOffset } = storeToRefs(timerStore);

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

const triggerAlarm = () => {
  if (alarmSound.value) {
    alarmSound.value.currentTime = 0; // 再生位置を先頭に戻す
    alarmSound.value.play().catch(error => {
      console.error("Failed to play alarm sound:", error);
      console.warn("This might be due to browser autoplay policies. User interaction might be required.");
    });
  }
}

const triggerPreAlarm = () => {
  if (preAlarmSound.value) {
    preAlarmSound.value.currentTime = 0; // 再生位置を先頭に戻す
    preAlarmSound.value.play().catch(error => {
      console.error("Failed to play pre-alarm sound:", error);
      console.warn("This might be due to browser autoplay policies. User interaction might be required.");
    });
  }
}

const tick = () => {
  const prevNow = now.value; // 前回のnowの値を保存
  now.value = Math.floor(Date.now() / 1000) + timeOffset.value;

  // タイマーが実行中で一時停止中でない場合のみアラームをチェック
  if (timer.isRunning && !timer.isPausing) {
    const prevRemainingSeconds = timer.endAt - prevNow;
    const currentRemainingSeconds = timer.endAt - now.value;

    // Pre-alarm check: 60秒の閾値を「超えた瞬間」に鳴らす
    if (prevRemainingSeconds > 60 && currentRemainingSeconds <= 60 && !preAlarmTriggered) {
      triggerPreAlarm();
      preAlarmTriggered = true;
    }

    // Final alarm check: 0秒の閾値を「超えた瞬間」に鳴らす
    if (prevRemainingSeconds > 0 && currentRemainingSeconds <= 0 && !alarmTriggered) {
      triggerAlarm();
      alarmTriggered = true;
    }
  }

  rafId = requestAnimationFrame(tick);
}

onMounted(() => {
  alarmSound.value = new Audio(alarmUrl)
  preAlarmSound.value = new Audio(preAlarmUrl)

  // Load both sounds
  alarmSound.value.load()
  preAlarmSound.value.load()

  const initialRemainingSeconds = timer.endAt - Math.floor(Date.now() / 1000);

  // 読み込み時に残り時間が60秒以下であれば、プレアラームは鳴らさない
  if (initialRemainingSeconds <= 60) {
    preAlarmTriggered = true;
  }

  // 読み込み時に残り時間が0秒以下であれば、メインアラームは鳴らさない
  if (initialRemainingSeconds <= 0) {
    alarmTriggered = true;
  }

  tick()
})

onUnmounted(() => {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null; // Reset rafId to null to avoid stale IDs
  }
  // アラーム音を停止し、再生位置をリセット
  if (alarmSound.value) {
    alarmSound.value.pause();
    alarmSound.value.currentTime = 0;
  }
  if (preAlarmSound.value) {
    preAlarmSound.value.pause();
    preAlarmSound.value.currentTime = 0;
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

  // requestAnimationFrame ループを即座に停止
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null; // IDをクリア
  }

  emits('onStop')
}
const onStart = () => {
  // Reset alarm flags
  alarmTriggered = false;

  // タイマーの初期設定時間が60秒以下の場合、preAlarmTriggeredをtrueに設定し、プレアラームが鳴らないようにする
  const initialTotalSeconds = timer.duration.minutes * 60 + timer.duration.seconds;
  preAlarmTriggered = initialTotalSeconds <= 60;

  // requestAnimationFrame ループが停止している場合のみ再開
  if (!rafId) {
    tick();
  }

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

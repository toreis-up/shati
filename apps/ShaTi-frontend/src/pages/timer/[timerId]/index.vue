<template>
    <TimerPage :timer="timer" @onStart="start" @on-pause="pause" @on-stop="stop" @on-resume="resume"></TimerPage>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

const route = useRoute();
const { timerId } = route.params;

const timerStore = useTimerStore();
const { connect, fetchTimer, disconnect, start, pause, stop, resume } = timerStore;
const { timer } = storeToRefs(timerStore);

// サーバーサイドでもデータをフェッチする
await fetchTimer(timerId.toString());

onMounted(() => {
  connect(timerId.toString());
});

onBeforeUnmount(() => {
  disconnect();
});
</script>

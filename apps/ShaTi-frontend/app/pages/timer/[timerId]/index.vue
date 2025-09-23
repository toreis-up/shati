<template>
    <TimerPage :timer="timer" @onEdit="edit" @onStart="start" @on-pause="pause" @on-stop="stop" @on-resume="resume" />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

const route = useRoute();
const { timerId } = route.params;

const timerStore = useTimerStore();
const { connect, fetchTimer, disconnect, start, pause, stop, resume } = timerStore;
const { timer } = storeToRefs(timerStore);

await useAsyncData(() => fetchTimer(timerId.toString()));

const edit = async () => {
  if (timer.value) {
    await timerStore.updateTimer(timer.value);
  }
}

onMounted(() => {
  connect(timerId.toString());
});

onBeforeUnmount(() => {
  disconnect();
});
</script>

<template>
    <TimerPage :timer="fetchedTimer" @onStart="start" @on-pause="pause" @on-stop="stop" @on-resume="resume" viewonly></TimerPage>
</template>

<script lang="ts" setup>
import { useTimerStore } from '../../../store/useTimerStore';

const route = useRoute();
const { timerId } = route.params;

const { connect, fetchTimer, disconnect, start, pause, stop, resume } = useTimerStore()

const { timer } = storeToRefs(useTimerStore())

const fetchedTimer = computed(() => {return timer.value})

onMounted(async() => {
  await fetchTimer(timerId.toString())
  connect(timerId.toString())
})

onBeforeUnmount(() => {
  disconnect()
})
</script>

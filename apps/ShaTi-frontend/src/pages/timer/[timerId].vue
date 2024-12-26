<template>
    <div>You accessing {{ timerId }}</div>
    <div>Your timer name: {{ fetchedTimer.name }}</div>
    <div>
      Your timer: {{ fetchedTimer.duration.minutes }} :
      {{ fetchedTimer.duration.seconds }}
    </div>
    <div>Your timer started at: {{ fetchedTimer.startAt }}</div>
    <div>Your timer ended at: {{ fetchedTimer.endAt }}</div>
    <div>Your Timer is {{ fetchedTimer.isRunning }}</div>
</template>

<script lang="ts" setup>
import { useTimerStore } from '../../store/useTimerStore';

const route = useRoute();
const { timerId } = route.params;

const { connect, fetchTimer, disconnect } = useTimerStore()

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

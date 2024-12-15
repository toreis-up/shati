<template>
  <div>
    <div>
      <p>現在のタイマーの状態: {{ timerState }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTimerWebSocket } from "~/composables/useTimerWebSocket";

const { timerState, connect } = useTimerWebSocket("ws");
connect();
</script>

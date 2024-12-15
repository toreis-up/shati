<template>
  <li>
    <ul v-for="item in timers">
      <p>{{ item.name }}</p>
    </ul>
  </li>
</template>

<script setup lang="ts">
const datas = await fetch('http://localhost:8787/timer')
const json = await datas.json()
const timers = json.timers
</script>
<template>
  <div>
    You accessing {{ timer_id }}
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();

const { timer_id } = route.params;
</script>
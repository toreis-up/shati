<template>
  <div>
    <USkeleton
      v-if="!isMounted"
      class="w-full h-full"
      />
    <NuxtImg v-else-if="colorMode === 'dark'" src="/images/shati_white.svg" alt="ShaTi Logo" />
    <NuxtImg v-else src="/images/shati_black.svg" alt="ShaTi Logo" />
  </div>
</template>

<script lang="ts" setup>
import { useColorMode, useMounted } from '@vueuse/core';

const colorMode = useColorMode();
const isMounted = useMounted();
</script>
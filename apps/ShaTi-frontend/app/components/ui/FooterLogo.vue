<template>
  <USkeleton v-if="!isMounted" class="rounded-full" />
  <NuxtImg
    v-else-if="colorMode === 'dark'"
    src="/images/shati_lp_white.webp"
    alt="ShaTi Logo"
  />
  <NuxtImg v-else src="/images/shati_lp_color.webp" alt="ShaTi Logo" />
</template>

<script lang="ts" setup>
import { useColorMode, useMounted } from '@vueuse/core';

const colorMode = useColorMode();
const isMounted = useMounted();
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 flex flex-col items-center justify-center">
      <div class="text-4xl sm:text-6xl md:text-9xl font-extrabold mb-10 duration-100 ease-in-out">Creating...</div>
      <div class="text-xl md:text-2xl text-slate-500">Please wait a moment</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { createTimer } = useTimerStore();

const {
  data: timer
} = await useAsyncData(
  async () => {
    const createdTimer = await createTimer();
    console.log(createdTimer);

    return createdTimer;
  },
  {
    server: true,
  }
);

if (timer.value && timer.value.id) {
  await navigateTo(`/timer/${timer.value.id}`, {
    replace: true,
  });
}
</script>

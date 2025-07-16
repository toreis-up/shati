<template>
  <div
    class="relative w-full overflow-hidden font-bold text-xl"
    @mouseenter="startHover"
    @mouseleave="stopHover"
  >
    <span class="block truncate" :class="autoScroll ? 'opacity-0' : 'opacity-100'" :title="title">
      {{ title }}
    </span>

    <div
      class="absolute inset-0 flex items-center overflow-hidden opacity-0 " :class="bgClass"
    >
      <span
        class="inline-block whitespace-nowrap"
        :style="scrollStyle"
        ref="scrollableText"
      >
        {{ title }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const { title, scrollSpeed, backgroundClass, autoScroll } = defineProps({
  title: {
    type: String,
    default: 'No Title',
  },
  scrollSpeed: {
    type: Number,
    default: 60,
  },
  backgroundClass: {
    type: String,
    default: ''
  },
  autoScroll: {
    type: Boolean,
    default: false
  }
});

const bgClass = computed(() => {
  let str = backgroundClass
  str += autoScroll ? 'opacity-100' : ' hover:opacity-100 '
  return str
})

const scrollableText = ref(null);
const parentContainer = ref(null);
const shouldScroll = ref(false);
const scrollDuration = ref(0);
const isHovered = ref(false);
const checkScroll = () => {
  if (scrollableText.value && parentContainer.value) {
    const textWidth = scrollableText.value.scrollWidth;
    const containerWidth = parentContainer.value.offsetWidth;
    shouldScroll.value = textWidth > containerWidth;
    if (shouldScroll.value) {
      scrollDuration.value = textWidth / scrollSpeed;
    }
    console.log(textWidth, containerWidth, shouldScroll.value);
  }
};
const startHover = () => {
  if (shouldScroll.value) {
    isHovered.value = true;
  }
};

const stopHover = () => {
  isHovered.value = false;
};

onMounted(() => {
  parentContainer.value = scrollableText.value?.parentElement;
  checkScroll();
  window.addEventListener('resize', checkScroll);
});
const scrollStyle = computed(() => {
  if (isHovered.value || autoScroll) {
    return {
      animation: `${scrollDuration.value}s linear infinite scroll-horizontal-loop`,
    };
  } else {
    return {
      animation: 'none',
      transform: 'translateX(0%)',
    };
  }
});
watch(() => title, checkScroll);
</script>

<style lang="css">
@keyframes scroll-horizontal-loop {
  0% {
    transform: translateX(0%);
  }
  15% {
    transform: translateX(0%);
  }
  90% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

</style>

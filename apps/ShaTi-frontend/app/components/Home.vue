<template>
  <UContainer class="flex items-center min-h-[calc(100vh-72px-265px)] overflow-hidden relative" :ui="{ wrapper: 'py-20' }">
    <div class="z-10">
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">タイムキーパーは<br>シャチに任せよう。</h1>
      <p class="text-base sm:text-lg mb-8">ShaTi /ˈʃɑːtʃi/ はオンラインでタイマーを共有できるツールです。<br>タイムキーパーだけがタイマーを監視する必要はもうありません。</p>
      <UButton to="/timer" color="secondary" variant="solid" class="font-bold inline-flex items-center">
        <span>使ってみる</span>
        <NuxtImg src="/images/arrow.svg" alt="arrow" class="ml-2" />
      </UButton>
    </div>
    <NuxtImg src="/images/shati_lp_black.webp" alt="ShaTi LP Image" class="absolute right-0 top-1/2 -translate-y-1/2 z-0 w-[576px] opacity-50 lg:opacity-100 transition-opacity duration-500 ease-in" fetchpriority="high" style="transform: scale(-1,1); object-fit: cover;" />
  </UContainer>
</template>

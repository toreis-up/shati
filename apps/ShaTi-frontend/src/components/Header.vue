<template>
  <header class="p-4 border-b border-primary-300">
    <div class="flex justify-between items-center max-w-[1440px] mx-auto">
      <NuxtLink to="/" class="flex items-center gap-2">
        <img src="~/assets/img/shati.svg" alt="ShaTi Logo" class="h-10 w-10" />
        <span class="text-xl font-bold">ShaTi</span>
      </NuxtLink>
      <nav>
        <ul class="flex items-center space-x-4">
          <li>
            <a href="#" class="hover:text-gray-400">
              <img src="~/assets/img/folder-clock-outline.svg" alt="History" class="h-8 w-8" />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

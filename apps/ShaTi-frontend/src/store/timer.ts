import { defineStore } from 'pinia'

export const useTimerStore = defineStore('timer', {
  state: () => ({
    timers
  })
})
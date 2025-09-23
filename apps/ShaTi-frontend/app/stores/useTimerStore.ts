import { defineStore } from 'pinia';
import type { Timer, TimerId } from '@shati/types';

type TimerResponse = Timer;
type TimeResponse = {
  time: number;
};

export const useTimerStore = defineStore('timer', () => {
  const config = useRuntimeConfig();

  // Accepts only alphanumeric IDs, dashes, and underscores (adjust as needed)
  function isValidTimerId(id: string): boolean {
    return typeof id === 'string' && /^[a-zA-Z0-9_-]+$/.test(id);
  }
  const timer = ref<Timer>({
    id: '',
    name: '',
    duration: {
      minutes: 0,
      seconds: 0,
    },
    remainDuration: {
      minutes: 0,
      seconds: 0,
    },
    isRunning: false,
    isPausing: false,
  });
  const socket = ref<WebSocket>(null as unknown as WebSocket);
  const connected = ref(false);
  const timeOffset = ref(0);

  function $reset() {
    timer.value = {
      id: '',
      name: '',
      duration: {
        minutes: 0,
        seconds: 0,
      },
      remainDuration: {
        minutes: 0,
        seconds: 0,
      },
      isRunning: false,
      isPausing: false,
    };
    socket.value = null as unknown as WebSocket;
    connected.value = false;
  }

  async function fetchTimer(timerId: TimerId) {
    const timerResponse = await $fetch<TimerResponse>(
      `${config.public.apiBase}/timer/${timerId}`
    );
    timer.value = { ...timerResponse };

    await syncTime();

    return timer.value;
  }

  async function syncTime() {
    try {
      const serverTimeResponse = await $fetch<TimeResponse>(
        `${config.public.apiBase}/time`
      );
      timeOffset.value = serverTimeResponse.time - Math.floor(Date.now() / 1000);
    } catch (error) {
      console.error("Failed to fetch server time, falling back to client time:", error);
      timeOffset.value = 0; // Fallback to client time
    }
  }

  function connect(timerId: TimerId) {
    if (socket.value) socket.value.close();
    socket.value = new WebSocket(
      `${config.public.apiBase}/timer/${timerId}/connect`
    );

    socket.value.onopen = () => {
      connected.value = true;
    };

    socket.value.onmessage = (event) => {
      const data = JSON.parse(event.data.toString());
      if (Object.prototype.hasOwnProperty.call(data, 'maintain')) {
        console.log('WebSocket maintain :)');
      } else timer.value = data;
    };

    socket.value.onerror = (error) => {
      console.error(error);
    };

    setTimeout(() => maintainWS(), 1000);
  }

  function maintainWS() {
    socket.value.send('maintain');
    setTimeout(() => {
      maintainWS();
    }, 5000);
  }

  async function start() {
    if (!timer.value.id || !isValidTimerId(timer.value.id)) {
      return;
    }
    await fetch(`${config.public.apiBase}/timer/${timer.value.id}/start`, {
      method: 'POST',
    });
  }

  async function stop() {
    if (!timer.value.id || !isValidTimerId(timer.value.id)) {
      return;
    }
    await fetch(`${config.public.apiBase}/timer/${timer.value.id}/stop`, {
      method: 'POST',
    });
  }

  async function pause() {
    if (!timer.value.id || !isValidTimerId(timer.value.id)) {
      return;
    }
    await fetch(`${config.public.apiBase}/timer/${timer.value.id}/pause`, {
      method: 'POST',
    });
  }

  async function resume() {
    if (!timer.value.id || !isValidTimerId(timer.value.id)) {
      return;
    }
    await fetch(`${config.public.apiBase}/timer/${timer.value.id}/resume`, {
      method: 'POST',
    });
  }

  function disconnect() {
    if (socket.value) {
      socket.value.close();
      socket.value = null as unknown as WebSocket;
      $reset();
    }
  }

  async function createTimer() {
    $reset();

    try {
      const timerResponse = await $fetch<TimerResponse>(`${config.public.apiBase}/timer`, {
        method: 'POST',
        body: {
          name: 'New Timer',
          duration: {
            minutes: 5,
            seconds: 0,
          },
        }
      })

      timer.value = { ...timerResponse };
    } catch (e: any) {
      console.error('Failed to create timer:', e);
    }

    return timer.value
  }

  async function updateTimer(updateData: Timer) {
    if (!updateData.id || !isValidTimerId(updateData.id)) {
      throw new Error('Invalid timer ID');
    }

    try {
      const updatedTimer = await $fetch<TimerResponse>(`${config.public.apiBase}/timer/${updateData.id}`, {
        method: 'PUT',
        body: {
          name: updateData.name,
          duration: updateData.duration,
        }
      });
      timer.value = { ...updatedTimer };
    } catch (e: any) {
      console.error('Failed to update timer:', e);
    }

    return timer.value;
  }

  return { timer, fetchTimer, connect, disconnect, start, stop, pause, resume, timeOffset, createTimer, updateTimer };
});

import { defineStore } from 'pinia';
import type { Timer, TimerId } from '@shati/types';

type TimerResponse = Timer;

export const useTimerStore = defineStore('timer', () => {
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
      `http://localhost:8787/timer/${timerId}`
    );
    timer.value = { ...timerResponse };

    return timer.value;
  }

  function connect(timerId: TimerId) {
    if (socket.value) socket.value.close();
    socket.value = new WebSocket(
      `ws://127.0.0.1:8787/timer/${timerId}/connect`
    );

    socket.value.onopen = () => {
      connected.value = true;
    };

    socket.value.onmessage = (event) => {
      const data = JSON.parse(event.data.toString());
      if (data.hasOwnProperty('maintain')) {
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
    console.log('hi');
    if (!timer.value.id) {
      return;
    }
    await fetch(`http://localhost:8787/timer/${timer.value.id}/start`, {
      method: 'POST',
    });
  }

  async function stop() {
    console.log('hi');
    if (!timer.value.id) {
      return;
    }
    await fetch(`http://localhost:8787/timer/${timer.value.id}/stop`, {
      method: 'POST',
    });
  }

  async function pause() {
    console.log('hi');
    if (!timer.value.id) {
      return;
    }
    await fetch(`http://localhost:8787/timer/${timer.value.id}/pause`, {
      method: 'POST',
    });
  }

  async function resume() {
    console.log('hi');
    if (!timer.value.id) {
      return;
    }
    await fetch(`http://localhost:8787/timer/${timer.value.id}/resume`, {
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

  return { timer, fetchTimer, connect, disconnect, start, stop, pause, resume };
});

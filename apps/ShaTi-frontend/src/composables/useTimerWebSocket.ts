import { ref } from "vue";
import {Timer} from '@ShaTi/types'

export const useTimerWebSocket = (timerId: string) => {
  const timerState = ref(null);
  let socket: WebSocket | null = null;

  const connect = () => {
    if (import.meta.server) {
      return false;
    }
    socket = new WebSocket(`ws://localhost:8787/${timerId}`);

    socket.onmessage = (event) => {
      console.log(event.data)
      timerState.value = JSON.parse(event.data);
    };

    socket.onclose = () => {
      console.log("WebSocket closed. Reconnecting...");
      setTimeout(connect, 1000); // 自動再接続
    };
  };

  const sendMessage = (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  return { timerState, connect, sendMessage };
};

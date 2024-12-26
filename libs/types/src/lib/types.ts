export function types(): string {
  return 'types';
}

export type Duration = {
  minutes: number;
  seconds: number;
};

export type TimerId = string;

export interface DOTimer {
  name: string;
  duration: Duration;
  startAt?: number;
  endAt?: number;
  isRunning: boolean;
}

export type Timer = {
  id: TimerId;
} & DOTimer;

export type TimerOutputList = ({ id: TimerId } & DOTimer)[];

export type TimerWebSocketType = 'change' | 'start' | 'stop';

export interface TimerWebSocketRequest {
  id: TimerId;
  type: TimerWebSocketType;
}

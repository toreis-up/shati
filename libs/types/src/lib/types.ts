export function types(): string {
  return 'types';
}

export type Duration = {
  minutes: number;
  seconds: number;
};

export interface Timer {
  name: string;
  duration: Duration;
  startAt?: number;
  endAt?: number;
  isRunning: boolean;
}

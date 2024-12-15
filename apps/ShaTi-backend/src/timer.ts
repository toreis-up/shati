import { DurableObject } from "cloudflare:workers";
import { Timer, Duration } from '@ShaTi/types';

type TimerCFList = Map<string, Timer>

type TimerOutputList = (
  { id: string } &
  Timer
)[]

function convertTimers(timers: TimerCFList): TimerOutputList {
  const result: TimerOutputList = []
  timers.forEach((timerData, id) => {
    result.push({
      id,
      ...timerData
    })
  })

  return result
}

export class TimerDurableObjects extends DurableObject {
  async list() {
    const cf_timers = await this.ctx.storage.list<Timer>({
      reverse: true,
      limit: 100,
    });

    const timers = convertTimers(cf_timers);

    return timers;
  }

  async fetch(request: Request) {
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    this.ctx.acceptWebSocket(server);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string) {
    ws.send(
      `[Durable Object] msg ${message}, connections: ${
        this.ctx.getWebSockets().length
      }`
    );

    this.broadcast(`[Durable Object Broadcast] msg ${message}`);
  }

  async webSocketClose(
    ws: WebSocket,
    code: number,
    reason: string,
    wasClean: boolean
  ) {
    // If the client closes the connection, the runtime will invoke the webSocketClose() handler.
    ws.close(code, "Durable Object is closing WebSocket");
    console.log('[Durable Object] Close')
  }

  async broadcast(msg: string) {
    for (const client of this.ctx.getWebSockets()) {
      try {
        client.send(msg)
      } catch (err) {
        console.log(err)
      }
    }
  }

  async create(name?: string, duration?: Duration) {
    if (!duration) {
      duration = {
        minutes: 5,
        seconds: 0,
      };
    }

    const newTimer: Timer = {
      name: name || "no name timer",
      duration: duration,
      startAt: undefined,
      endAt: undefined,
      isRunning: false,
    };

    const id = crypto.randomUUID();

    await this.ctx.storage.put(id, newTimer);

    return {id, ...newTimer};
  }

  async getTimer(id: string) {
    const cf_timer = await this.ctx.storage.get<TimerCFList>(id);
    const timer = convertTimers(cf_timer!);

    return timer;
  }
}
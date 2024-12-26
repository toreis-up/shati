import { DurableObject } from 'cloudflare:workers';
import type {
  DOTimer,
  Duration,
  TimerWebSocketRequest,
  TimerOutputList,
  TimerId,
} from '@shati/types';
import { extractUUID } from 'utils';

type TimerCFList = Map<TimerId, DOTimer>;

function convertTimers(timers: TimerCFList): TimerOutputList {
  const result: TimerOutputList = [];
  timers.forEach((timerData, id) => {
    result.push({
      id,
      ...timerData,
    });
  });

  return result;
}

export class TimerDurableObjects extends DurableObject {
  sockets = new Map<TimerId, WebSocket[]>();

  async list() {
    const cf_timers = await this.ctx.storage.list<DOTimer>({
      reverse: true,
      limit: 100,
    });

    const timers = convertTimers(cf_timers);

    return timers;
  }

  async fetch(request: Request) {
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    const id = extractUUID(request.url);

    this.ctx.acceptWebSocket(server, [id]);
    const socketMap = this.sockets.get(id);

    if (socketMap) {
      this.sockets.set(id, [...socketMap, server]);
    } else {
      this.sockets.set(id, [server]);
    }

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string) {
    const ctx: TimerWebSocketRequest = JSON.parse(message.toString());
    const timerId = ctx.id;

    ws.send(
      `[Durable Object] msg ${message}, connections: ${
        this.ctx.getWebSockets().length
      }`
    );

    this.multicast(timerId, message.toString());
  }

  async webSocketClose(
    ws: WebSocket,
    code: number,
    reason: string,
    wasClean: boolean
  ) {
    // If the client closes the connection, the runtime will invoke the webSocketClose() handler.
    const timerId = this.ctx.getTags(ws)[0];
    const socketMap = this.sockets.get(timerId);
    if (socketMap) {
      const socketIdx = socketMap.indexOf(ws);
      if (socketIdx > -1) {
        socketMap.splice(socketIdx, 1);
      }
      
      if (socketMap.length === 0) {
        this.sockets.delete(timerId);
      } else {
        this.sockets.set(timerId, socketMap);
      }
    }
    ws.close(code, 'Durable Object is closing WebSocket');
  }

  async broadcast(msg: string) {
    for (const client of this.ctx.getWebSockets()) {
      try {
        client.send(msg);
      } catch (err) {
        console.log(err);
      }
    }
  }
  async multicast(id: TimerId, msg: string) {
    for (const client of this.sockets.get(id) || []) {
      try {
        client.send(msg);
      } catch (err) {
        console.log(err);
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

    const newTimer: DOTimer = {
      name: name || 'no name timer',
      duration: duration,
      startAt: undefined,
      endAt: undefined,
      isRunning: false,
    };

    const id = crypto.randomUUID();

    await this.ctx.storage.put(id, newTimer);

    return { id, ...newTimer };
  }

  async getTimer(id: string) {
    const cf_timer = await this.ctx.storage.get<DOTimer>(id);
    const timer = { id, ...cf_timer };

    return timer;
  }
}

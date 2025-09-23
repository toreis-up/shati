import { DurableObject } from 'cloudflare:workers';
import type {
  DOTimer,
  Duration,
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

  async webSocketMessage(ws: WebSocket) {
    // ws.send(
    //   `[Durable Object] msg ${message}, connections: ${
    //     this.ctx.getWebSockets().length
    //   }`
    // );

    ws.send('{"maintain": "OK"}');
  }

  async webSocketClose(
    ws: WebSocket,
    code: number
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
      remainDuration: duration,
      startAt: 0,
      endAt: 0,
      isRunning: false,
      isPausing: false,
    };

    const id = crypto.randomUUID();

    await this.ctx.storage.put(id, newTimer);

    return { id, ...newTimer };
  }

  async update(id: TimerId, updatedData: Partial<Exclude<DOTimer, 'id'>>) {
    const cf_timer = await this.ctx.storage.get<DOTimer>(id);
    if (!cf_timer) {
      throw new Error('Timer not found');
    }

    const updatedTimer = { ...cf_timer, ...updatedData };
    await this.ctx.storage.put(id, updatedTimer);

    await this.multicast(id, JSON.stringify(updatedTimer));

    return { id, ...updatedTimer };
  }

  async getTimer(id: TimerId) {
    const cf_timer = await this.ctx.storage.get<DOTimer>(id);
    const timer = { id, ...cf_timer };

    return timer;
  }

  async startTimer(id: TimerId) {
    const cf_timer = await this.getTimer(id);

    cf_timer.startAt = this.nowSecond();
    cf_timer.endAt =
      this.nowSecond() +
      60 * (cf_timer.duration?.minutes || 0) +
      (cf_timer.duration?.seconds || 0);
    cf_timer.isRunning = true;
    cf_timer.isPausing = false;
    cf_timer.remainDuration = undefined;
    await this.ctx.storage.put(id, cf_timer);

    await this.multicast(id, JSON.stringify(cf_timer));

    return cf_timer;
  }

  async stopTimer(id: TimerId) {
    const cf_timer = await this.getTimer(id);

    cf_timer.startAt = undefined;
    cf_timer.endAt = undefined;
    cf_timer.isRunning = false;
    cf_timer.isPausing = false;
    cf_timer.remainDuration = undefined;
    await this.ctx.storage.put(id, cf_timer);

    await this.multicast(id, JSON.stringify(cf_timer));

    return cf_timer;
  }

  async resumeTimer(id: TimerId) {
    const cf_timer = await this.getTimer(id);

    cf_timer.startAt = this.nowSecond();
    cf_timer.endAt =
      this.nowSecond() +
      60 * (cf_timer.remainDuration?.minutes || 0) +
      (cf_timer.remainDuration?.seconds || 0);
    cf_timer.isPausing = false;
    await this.ctx.storage.put(id, cf_timer);

    await this.multicast(id, JSON.stringify(cf_timer));

    return cf_timer;
  }

  async pauseTimer(id: TimerId) {
    const cf_timer = await this.getTimer(id);

    const remain = (cf_timer.endAt || 0) - this.nowSecond();
    const remainObj = {
      minutes: remain < 0 ? Math.ceil(remain / 60) : Math.floor(remain / 60),
      seconds: remain % 60,
    };
    cf_timer.remainDuration = remainObj;

    cf_timer.startAt = undefined;
    cf_timer.endAt = undefined;
    cf_timer.isPausing = true;
    await this.ctx.storage.put(id, cf_timer);

    await this.multicast(id, JSON.stringify(cf_timer));
    return cf_timer;
  }

  nowSecond() {
    return Math.floor(Date.now() / 1000);
  }
}

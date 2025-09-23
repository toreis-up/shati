import { Hono } from 'hono';
import { TimerDurableObjects } from './timer';
import { DOTimer } from '@shati/types';
import { createMiddleware } from 'hono/factory';
import { cors } from 'hono/cors';

type Env = {
  Bindings: {
    TIMERS: DurableObjectNamespace<TimerDurableObjects>;
    NODE_ENV: 'development' | 'production' | 'test';
  };
  Variables: {
    timer: DOTimer;
    timers: DOTimer[];
    stub: DurableObjectStub<TimerDurableObjects>;
    TIMER_ID: string;
  };
};

const app = new Hono<Env>();

app.use('*', async (c, next) => {
  await cors({
    origin: ['https://shati.reisan.dev', ...(c.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  });
  await next();
});

const durableObjectMiddleware = createMiddleware<Env>(async (c, next) => {
  const id = c.env.TIMERS.idFromName(c.var.TIMER_ID);
  const stub = c.env.TIMERS.get(id);
  c.set('stub', stub);
  await next();
});

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/time', cors(), (c) => {
  return c.json({ time: Math.floor(Date.now() / 1000) });
});


app.get('/timer', durableObjectMiddleware, cors(), async (c) => {
  const timers = await c.var.stub.list();
  return c.json({ timers: [...timers] });
});

app.post('/timer', durableObjectMiddleware, cors(), async (c) => {
  const timer_obj = await c.req.json();
  console.log(timer_obj.title);
  const new_timer = await c.var.stub.create(timer_obj.name, timer_obj.duration);

  return c.json(new_timer);
});

app.put('/timer/:id', durableObjectMiddleware, cors(), async (c) => {
  const timerId = await c.req.param('id');

  const timer = await c.var.stub.getTimer(timerId);
  if (!timer) {
    return c.json({ error: 'Timer not found' }, 404);
  }

  const updatedData = await c.req.json();
  const updatedTimer = await c.var.stub.update(timerId, updatedData);

  return c.json(updatedTimer);
})

app.get('/timer/:id', durableObjectMiddleware, cors(), async (c) => {
  const timerId = await c.req.param('id');

  const timer = await c.var.stub.getTimer(timerId);
  return c.json(timer);
});

app.post('/timer/:id/start', durableObjectMiddleware, cors(), async (c) => {
  const timerId = await c.req.param('id');

  return c.json(await c.var.stub.startTimer(timerId))
})

app.post('/timer/:id/resume', durableObjectMiddleware, cors(), async (c) => {
  const timerId = await c.req.param('id');

  return c.json(await c.var.stub.resumeTimer(timerId));
});

app.post('/timer/:id/stop', durableObjectMiddleware, cors(), async (c) => {
  const timerId = await c.req.param('id');

  return c.json(await c.var.stub.stopTimer(timerId))
});

app.post('/timer/:id/pause', durableObjectMiddleware, cors(), async (c) => {
  const timerId = await c.req.param('id');

  return c.json(await c.var.stub.pauseTimer(timerId))

});

app.get('/timer/:id/connect', durableObjectMiddleware, async (c) => {
  return c.var.stub.fetch(c.req.raw);
});

app.get('/ws', (c) => {
  const id = c.env.TIMERS.idFromName('timers');
  const connection = c.env.TIMERS.get(id);

  return connection.fetch(c.req.raw);
});

export { TimerDurableObjects };

export default app;

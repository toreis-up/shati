import { Hono } from "hono";
import { Timer, TimerDurableObjects } from "./timer";
import { createMiddleware } from "hono/factory";

type Env = {
  Bindings: {
    TIMERS: DurableObjectNamespace<TimerDurableObjects>;
  };
  Variables: {
    timer: Timer;
    timers: Timer[];
    stub: DurableObjectStub<TimerDurableObjects>;
    TIMER_ID: string
  };
};

const app = new Hono<Env>();

const durableObjectMiddleware = createMiddleware<Env>(async (c, next) => {
  const id = c.env.TIMERS.idFromName(c.var.TIMER_ID);
  const stub = c.env.TIMERS.get(id);
  c.set("stub", stub)
  await next();
})

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/timer", durableObjectMiddleware, async (c) => {
  const timers = await c.var.stub.list()
  return c.json({'timers': [...timers]})
})

app.post("/timer", durableObjectMiddleware, async (c) => {
  const timer_obj = await c.req.json()
  console.log(timer_obj.title)
  const new_timer = await c.var.stub.create(timer_obj.name, timer_obj.duration)

  return c.json({'timer': new_timer})
})

app.get(
  "/ws",
  (c) => {
    const id = c.env.TIMERS.idFromName("timers");
    const connection = c.env.TIMERS.get(id);

    return connection.fetch(c.req.raw);
  }
);

export { TimerDurableObjects,};

export default app;

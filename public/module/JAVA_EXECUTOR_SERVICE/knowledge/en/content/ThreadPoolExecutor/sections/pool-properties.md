### corePoolSize

The number of workers that the pool tries to maintain according to the core policy. By default, core workers are usually created when there is a task, unless actively prestarted.

### maximumPoolSize

Limit the maximum number of workers when the pool needs to expand after the queue does not accept additional tasks.

### workQueue

Queue determines how the backlog is kept.

A very large queue can do `maximumPoolSize` is almost not used because the task keeps being enqueued.

A bounded queue helps limit the backlog but forces the system to be strategic when capacity runs out.

### keepAliveTime

The time the worker exceeds the core allowed to idle before being removed. If enabled `allowCoreThreadTimeOut`, the rule can be applied to the core worker as well.

By default, the core worker is retained even if idle. When calling:

```java
executor.allowCoreThreadTimeOut(true);
```

Core Workers can also be revoked later `keepAliveTime`. Trade-off is a reduction in resources when the workload is sparse, but later requests may incur the cost of recreating the worker. If the workload goes up/down continuously, the timeout is too short and can cause thread churn instead of useful savings.

### prestartAllCoreThreads

Prepare your core workers before the next task. Useful when warm-up latency is important, but in exchange for creating resources early.

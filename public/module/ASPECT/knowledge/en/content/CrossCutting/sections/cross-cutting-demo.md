Controller:

```text
CrossCuttingController#observeCrossCutting()
```

Endpoint:

```text
GET /aop/cross-cutting/observe
```

Target methods:

```text
CrossCuttingService#createOrder()
CrossCuttingService#cancelOrder()
```

Cross-cutting behavior:

```text
CrossCuttingLoggingAspect#logAround(...)
```

The response `events` will look like:

```text
logging-before:createOrder
target:create-order
logging-after:createOrder
logging-before:cancelOrder
target:cancel-order
logging-after:cancelOrder
```

Open `CrossCuttingService` and verify that the two business methods do not write `logging-before` or `logging-after` themselves.

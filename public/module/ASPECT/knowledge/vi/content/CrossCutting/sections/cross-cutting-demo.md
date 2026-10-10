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

Response `events` sẽ có dạng:

```text
logging-before:createOrder
target:create-order
logging-after:createOrder
logging-before:cancelOrder
target:cancel-order
logging-after:cancelOrder
```

Hãy mở `CrossCuttingService` và kiểm tra: hai business method không tự viết `logging-before` hay `logging-after`.

Controller:

```text
AroundAdviceController#timing()
```

Endpoint:

```text
GET /aop/around/timing
```

Target:

```text
AroundAdviceService#timedOperation()
```

Event:

```text
around:before-proceed
target:timedOperation
around:after-proceed:elapsed-nanos=...
```

Điểm cần quan sát là code sau `proceed()` chỉ chạy sau khi target đã hoàn thành hoặc control quay trở lại advice.

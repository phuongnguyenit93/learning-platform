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

Events:

```text
around:before-proceed
target:timedOperation
around:after-proceed:elapsed-nanos=...
```

The important observation is that code after `proceed()` runs only after the target has completed or control has returned to the advice.

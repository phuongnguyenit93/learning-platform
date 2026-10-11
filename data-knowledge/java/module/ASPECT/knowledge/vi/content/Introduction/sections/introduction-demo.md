Controller:

```text
IntroductionController#observeIntroduction()
```

Endpoint:

```text
GET /aop/advanced/introduction/observe
```

Target:

```text
IntroductionTargetService#businessOperation()
```

Response chứng minh:

```text
targetClassImplementsUsageTracked = false
proxyImplementsUsageTracked       = true
introducedInterface               = true
```

Controller cast proxy sang:

```text
UsageTracked
```

rồi tăng counter từ `0` lên `2` trước khi gọi business method.

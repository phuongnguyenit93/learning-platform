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

The response proves:

```text
targetClassImplementsUsageTracked = false
proxyImplementsUsageTracked       = true
introducedInterface               = true
```

The controller casts the proxy to:

```text
UsageTracked
```

and increments the counter from `0` to `2` before invoking the business method.

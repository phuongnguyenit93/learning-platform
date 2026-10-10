Controller:

```text
OrderingController#observeOrdering()
```

Endpoint:

```text
GET /aop/ordering/observe
```

Target:

```text
OrderingService#execute()
```

Two Aspects:

```text
OuterOrderingAspect @Order(1)
InnerOrderingAspect @Order(2)
```

Response `events`:

```text
order-1:before
order-2:before
target:ordering
order-2:after
order-1:after
```

This is direct evidence of the nested mental model.

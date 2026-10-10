Java allows composed lambdas to mutate objects, write logs, call databases, or perform any other side effect. Functional interfaces do not enforce purity.

The risk is that composition can visually resemble a data transformation while secretly depending on execution count and order.

```java
Function<Order, Order> record = order -> {
    auditService.record(order);
    return order;
};
```

If such a function is composed or reused, the audit call runs every time the function is invoked. That may be correct, but the effect should be obvious from naming and placement.

Prefer pure transformations for reusable composition when practical. When effects are required, keep them explicit and close to the boundary where they belong.

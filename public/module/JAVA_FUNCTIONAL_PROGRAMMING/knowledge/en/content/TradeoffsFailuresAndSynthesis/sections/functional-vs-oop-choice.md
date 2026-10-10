Passing a functional interface is useful when the variation is primarily **one behavior**: a comparison rule, transformation, validation rule, callback, or strategy that has little independent state.

An object-oriented abstraction is often clearer when the concept owns identity, multiple related operations, lifecycle, or substantial state.

```java
Comparator<Order> ordering = Comparator.comparing(Order::createdAt);
```

That single behavior fits naturally as a function-like contract. By contrast, a payment provider with authorization, capture, refund, credentials, and lifecycle rules is usually better represented as a richer object contract.

Java lets the styles cooperate: functional interfaces are interfaces, evaluating a lambda yields a value referring to an instance of its target functional-interface type, and object-oriented code can accept behavior parameters where that improves flexibility. Java does not guarantee a fresh lambda object for every evaluation, so code should not infer a stable implementation class or object identity from that fact.

A lambda is only syntax for implementing a functional-interface contract. Java does not require that implementation to be pure. A lambda can mutate an object, write a file, update a database, log, or call a remote service.

```java
Consumer<Order> publish = order -> eventBus.publish(order);
```

That can be exactly what the program needs. The problem starts when a lambda *looks* like a simple transformation or condition but performs hidden work whose timing or repetition matters.

A useful rule is to make effects visible through naming and placement. If behavior changes external state, readers should be able to discover that without inspecting every lambda body.

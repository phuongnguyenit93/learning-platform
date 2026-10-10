`Optional` is most useful as a return type when "no result" is a normal possibility callers should see in the method contract.

```java
Optional<Order> findOrder(OrderId id);
```

It is usually less helpful as a field or parameter used everywhere. A parameter often has a clearer domain model if separate methods, overloads, a request object, or a nullable convention already expresses the choice. A collection-returning method often communicates "no elements" naturally with an empty collection instead of `Optional<List<T>>`.

These are design guidelines, not compiler restrictions. The question is whether `Optional` makes the API's absence semantics clearer for its callers.

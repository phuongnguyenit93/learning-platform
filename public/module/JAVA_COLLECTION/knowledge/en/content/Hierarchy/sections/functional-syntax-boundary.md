Some Collection APIs receive **behavior** supplied by the caller, so later chapters use syntax such as:

```java
orders.removeIf(order -> order.totalCents() == 0);
Comparator.comparingLong(Order::id);
selected.toArray(Order[]::new);
```

For this module, it is enough to read them as:

```text
order -> ...
→ a function that receives an order and produces a result

Order::id
→ a reference to the behavior that obtains an Order id

Order[]::new
→ a reference to creating an Order[] of a requested size
```

Lambdas, functional interfaces, and method references have their own functional-programming curriculum. Here they are only **syntax used to pass behavior into Collection APIs**, not foundational Collection concepts.

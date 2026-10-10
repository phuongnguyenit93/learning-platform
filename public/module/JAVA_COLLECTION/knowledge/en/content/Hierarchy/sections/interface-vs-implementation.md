Application code should normally type a variable by the **capability the caller needs**. The concrete class chooses how that contract is implemented.

```java
List<Order> orders = new ArrayList<>();
orders.add(new Order(1001, 7, 120));
orders.add(new Order(1002, 7, 80));
```

Here:

- `List<Order>` is the contract: ordered, positional, duplicates allowed.
- `ArrayList<Order>` is the implementation: a resizable array used to satisfy that contract.

A method that only visits orders can accept a broader type:

```java
int totalRevenue(Collection<Order> orders) {
    int total = 0;
    for (Order order : orders) {
        total += order.totalCents();
    }
    return total;
}
```

The method does not need an index or knowledge of `ArrayList` versus `HashSet`, so `Collection<Order>` accurately describes its dependency.

If another method needs `get(0)`, then `List<Order>` is the right contract. “Program to an interface” does not mean “always choose the widest interface.” It means choose the **smallest interface that still expresses every required operation**.

That boundary also makes implementation changes easier:

```java
List<Order> orders = new ArrayList<>();
// A different List implementation can be chosen if the workload changes,
// as long as callers depend only on the List contract.
```

Generics determine element types such as `List<Order>` and `Map<Long, Order>`. This module focuses on collection behavior and storage contracts; detailed variance and PECS rules belong to the Generics module.

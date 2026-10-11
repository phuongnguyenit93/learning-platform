At the beginner mental-model level, a **collection** is an object that manages **a group of elements** so application code does not have to manage every value as a separate variable.

For example:

```java
List<Order> orders = new ArrayList<>();

orders.add(new Order(1001, 7, 120));
orders.add(new Order(1002, 8, 90));
orders.add(new Order(1003, 7, 150));

System.out.println(orders.size());

for (Order order : orders) {
    System.out.println(order.id());
}
```

Instead of creating `order1`, `order2`, `order3`, and so on, the program works with **one object representing the whole group**.

Read the declaration from left to right:

```java
List<Order> orders = new ArrayList<>();
```

- `List<Order>` says the variable follows the `List` contract and its element type is `Order`;
- `new ArrayList<>()` chooses `ArrayList` as the concrete implementation;
- the diamond `<>` lets the compiler infer `Order` from the target type, so `new ArrayList<Order>()` does not have to repeat it.

Generic collection element types are reference types. Primitive values use wrapper types such as `List<Integer>` for `int` and `List<Long>` for `long`; boxing/unboxing details belong to the language and Generics topics.

### The problem before collections

Arrays already let Java store several values of one component type:

```java
Order[] orders = new Order[100];
```

Arrays remain useful when the size is fixed or an API/performance requirement calls for them. But using an array for dynamic application data often means manually solving recurring problems:

```text
The array is full. What now?
→ allocate a larger array and copy values

Remove an element from the middle?
→ shift remaining elements manually

Require uniqueness?
→ write duplicate-detection logic

Look up an order by id?
→ scan or build a separate index structure

Need FIFO/LIFO processing?
→ manage head/tail positions yourself
```

The Collections Framework provides standardized structures for these common responsibilities instead of making every application reinvent them.

### What is the Java Collections Framework?

The **Java Collections Framework (JCF)** is the standard set of interfaces, implementations, and supporting algorithms/utilities for representing and manipulating groups of data.

A useful mental model is:

```text
Many data elements
        ↓
Need one object to manage the group
        ↓
The Collections Framework provides different contracts
        ↓
List / Set / Queue / Deque / Map
        ↓
choose the contract from the behavior the problem needs
```

The same `Order` domain data may therefore be represented differently for different questions:

```java
List<Order> ordersInArrivalOrder = new ArrayList<>();
Set<Long> uniqueUserIds = new HashSet<>();
Map<Long, Order> orderById = new HashMap<>();
Deque<Order> pendingOrders = new ArrayDeque<>();
```

This is why Collection is not merely “a List that stores many objects.” It is **a family of abstractions for different group-data problems**.

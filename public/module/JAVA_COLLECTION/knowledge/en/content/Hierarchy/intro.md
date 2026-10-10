# Collection Foundation: Why the Collections Framework Exists

Before learning `List`, `Set`, `Map`, or `Queue`, start with a simpler question: **what is a collection, and why does a Java program need one?**

Suppose a program has only three orders. It can store them in three separate variables:

```java
Order first = new Order(1001, 7, 120);
Order second = new Order(1002, 8, 90);
Order third = new Order(1003, 7, 150);
```

Real data rarely stops at three items. The number of orders may be 0, 10, 1,000, or may change while the program is running. Code therefore needs a way to **group many objects and operate on the group as one object**: add values, remove values, search, iterate, count, preserve order, enforce uniqueness, or look values up by key.

That is the broad problem solved by the Java Collections Framework.

We will reuse a small dataset throughout this module:

```java
record User(long id, String name) {}
record Order(long id, long userId, int totalCents) {}
```

The same orders can be kept in creation order, reduced to unique user IDs, indexed by order ID, or placed in a processing queue. All of those structures contain multiple values, but they promise different behavior.

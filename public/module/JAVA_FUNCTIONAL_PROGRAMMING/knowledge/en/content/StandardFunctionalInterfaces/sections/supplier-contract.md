`Supplier<T>` produces a value without receiving an argument through its functional method:

```java
T get();
```

Example:

```java
Supplier<UUID> idFactory = UUID::randomUUID;
UUID id = idFactory.get();
```

The important idea is **deferred production**. Passing a `Supplier<T>` passes the recipe for obtaining a value, rather than the value that has already been computed.

```java
Supplier<String> expensiveMessage = () -> buildExpensiveMessage();
```

Whether and when `get()` is called is controlled by the receiving code. This is useful for factories, lazy fallback values, test data providers, and other cases where value creation should happen on demand.

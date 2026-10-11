`Consumer<T>` receives a value and returns no result. Its functional method is:

```java
void accept(T value);
```

Example:

```java
Consumer<String> printer = text -> System.out.println(text);
printer.accept("hello");
```

A consumer usually represents an action with an observable effect: logging, sending data, updating an object, invoking another service, and so on.

Because a `Consumer` returns `void`, it is a poor fit when callers need a transformed value. In that case, a `Function` or another value-producing contract is usually clearer.

Side effects are legal in Java functional code, but their placement affects readability and testability. The final chapter returns to that design trade-off.

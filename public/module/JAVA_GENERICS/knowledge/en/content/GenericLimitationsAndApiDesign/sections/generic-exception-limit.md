A generic class cannot extend `Throwable`:

```java
// class Problem<T> extends Exception {} // compile error
```

A type parameter cannot be used as a catch type:

```java
// catch (T ex) { ... }
```

However, a bounded type parameter can participate in a `throws` contract:

```java
static <E extends Exception> void run(ThrowingTask<E> task) throws E {
    task.run();
}

interface ThrowingTask<E extends Exception> {
    void run() throws E;
}
```

This can carry checked-exception type information through the compile-time API without creating a generic exception class.

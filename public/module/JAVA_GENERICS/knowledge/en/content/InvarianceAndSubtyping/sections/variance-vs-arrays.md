Java arrays are covariant:

```java
Integer[] integers = {1, 2};
Number[] numbers = integers; // compiles
```

The runtime then has to check stores:

```java
numbers[0] = 3.14; // ArrayStoreException
```

Arrays retain their component type at runtime, so the JVM can detect the bad store.

Generics choose a different trade-off:

```java
List<Integer> integers = new ArrayList<>();
// List<Number> numbers = integers; // compile error
```

The unsafe relationship is rejected statically instead of being accepted and guarded by a runtime store check.

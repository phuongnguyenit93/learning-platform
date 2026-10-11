Effectively final does not imply immutable.

```java
List<String> names = new ArrayList<>();

Consumer<String> addName = name -> names.add(name);
addName.accept("Lan");
addName.accept("Minh");
```

The local variable `names` is never reassigned, so it is effectively final and can be captured. The `ArrayList` itself is still mutable, so the lambda can call `add` on it.

The following is different:

```java
List<String> names = new ArrayList<>();
Consumer<String> addName = name -> names.add(name);

// names = new ArrayList<>(); // would break effectively-final status
```

This distinction is technically legal but also a design warning. Mutation hidden inside callbacks or composed behavior can make execution order and shared state harder to reason about. When state changes are important, make ownership and timing explicit instead of assuming that lambda syntax makes mutation harmless.

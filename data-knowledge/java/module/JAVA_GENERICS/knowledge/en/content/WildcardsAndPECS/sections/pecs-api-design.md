A narrow signature:

```java
static void moveDogs(List<Dog> source, List<Dog> target)
```

works only when both sides are exactly `List<Dog>`.

A more flexible signature:

```java
static void moveDogs(
        List<? extends Dog> source,
        List<? super Dog> target)
```

allows a source of a `Dog` subtype and a destination whose element type is `Dog` or a supertype.

The JDK uses this shape broadly; APIs such as `Collections.copy` model the source as a producer and the destination as a consumer.

Do not apply PECS mechanically:

- exact `List<T>` or a named type parameter may be clearer when the parameter must both read and write the same `T`;
- a wildcard that adds no real flexibility only adds cognitive cost;
- a named type parameter is appropriate when the return type or several inputs must relate directly to one another.

In particular, **avoid wildcard return types in public APIs** when a more specific return type can express the contract. A return such as `List<? extends Animal>` forces callers to keep carrying and reasoning about the unknown captured type. Wildcards are often most useful at **input boundaries**, where an API wants to accept a broader family of valid parameterized types.

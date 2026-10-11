A type parameter should express a **real type relationship**, not mechanically replace every `Object`.

For example:

```java
interface Repository<ID, T> {
    T findById(ID id);
    void save(T value);
}
```

The signature tells a caller:

- which type identifies an entity;
- which type the repository returns;
- which values it accepts.

Practical guidelines:

- use a type parameter when several members must share the same type identity;
- avoid returning `Object` when the API really knows a stronger type;
- keep the number of type parameters only as large as the model requires;
- if a caller only needs “some unknown type,” a wildcard may be clearer than a named parameter that establishes no relationship;
- do not use raw types merely to shorten syntax.

A practical decision table ties the module together:

| API need | Usually appropriate tool |
| --- | --- |
| Several positions must preserve **the same type** | A named type parameter such as `<T>` |
| `T` must provide a minimum capability | A bounded type parameter such as `<T extends Number>` |
| The API only needs “some type” and does not need to name it again | Wildcard `?` |
| A parameter mainly produces `T` values | `? extends T` |
| A parameter mainly consumes `T` values | `? super T` |
| A parameter must both read and write the exact same `T` | An exact type such as `List<T>` is often clearer than a wildcard |
| Legacy integration forces a raw type | Contain it at a small boundary, validate/convert, then return to typed code |
| Code needs object creation or runtime class information | Receive a factory, `Class<T>`, or another suitable type token from the caller |

The point is not to choose the most sophisticated syntax. Start from **the type relationship the API actually needs to express**, then use the simplest mechanism that preserves that relationship and type safety.

### Generics Mental Model Summary

```text
Generic Types / Methods
→ express reusable type relationships

Bounds
→ require minimum capabilities

Invariance
→ prevents unsafe subtype assumptions between parameterized types; especially important for mutable structures

Wildcards + PECS
→ widen API boundaries by read/write direction

Raw Types
→ legacy compatibility escape hatch that can weaken safety

Type Erasure
→ implementation foundation and source of many restrictions
```

The goal of generic API design is not to use the most sophisticated syntax. It is to **express the real type relationship clearly enough that the compiler can protect both callers and implementations as early as possible**.

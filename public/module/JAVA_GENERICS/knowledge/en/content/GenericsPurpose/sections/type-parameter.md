In:

```java
class Box<T> { ... }
```

`T` is a **type parameter**: a type variable declared by `Box`.

In:

```java
Box<String> textBox = new Box<>();
Box<Integer> numberBox = new Box<>();
```

`String` and `Integer` are **type arguments**.

A declaration may have several type parameters:

```java
final class Pair<K, V> {
    private K key;
    private V value;
}
```

Common naming conventions:

| Name | Typical meaning |
| --- | --- |
| `T` | Type |
| `E` | Element |
| `K` | Key |
| `V` | Value |
| `R` | Result |

These are conventions only; the compiler assigns no special meaning to the letters.

A parameterized type such as `Box<String>` participates in compile-time type checking. It does not imply that the JVM creates a completely separate class definition for every type argument; Type Erasure explains that later.

The next chapter moves from **“what are generics?”** to **“how do generic types and generic methods get declared and used?”**

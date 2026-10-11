The type-parameter list appears **before the return type**:

```java
static <T> T echo(T value) {
    return value;
}
```

Here:

- `<T>` declares the method type parameter;
- `T` in the parameter and return type refers to the same type variable;
- the method may live in either a generic or a non-generic class.

Another example:

```java
static <T> Box<T> boxOf(T value) {
    Box<T> box = new Box<>();
    box.set(value);
    return box;
}
```

Generic methods are useful when the type relationship belongs to **one operation**, not to object state.

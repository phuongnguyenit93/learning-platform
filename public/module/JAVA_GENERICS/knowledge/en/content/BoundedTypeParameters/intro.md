# Bounded Type Parameters

Generics let us say “this method works with **some type T**.” Sometimes, however, “any type” is too weak.

Suppose we want one method for several numeric types:

```java
static <T> double twice(T value) {
    // value.doubleValue(); // compile error
    return 0;
}
```

The compiler only knows that `T` is an unknown type. It cannot assume that every possible `T` has `doubleValue()`.

We need to express:

```text
"T may vary,
but T must at least be a Number"
```

That is the purpose of a **bounded type parameter**: preserve generic reuse while restricting the legal types enough to give the implementation a stronger contract.

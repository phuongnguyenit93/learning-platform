```java
class Holder<T> {
    T current;

    <R> R echoOther(R value) {
        return value;
    }
}
```

- `T` belongs to the class and participates in the instance contract;
- `R` exists only within the declaration of `echoOther`.

A method is allowed to reuse the same type-parameter name and shadow the class parameter:

```java
class Sample<T> {
    <T> T identity(T value) {
        return value;
    }
}
```

These two `T` variables are different. The syntax is legal but confusing, so a different name is usually better.

An unconstrained `T` exposes only capabilities guaranteed by `Object`. The next chapter adds **bounds** when generic code needs a stronger contract.

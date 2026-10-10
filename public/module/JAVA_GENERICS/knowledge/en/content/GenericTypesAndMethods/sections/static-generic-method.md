A static method is not tied to an instance, but it can still be generic when **the method declares its own type parameter**:

```java
final class Boxes {
    static <T> Box<T> of(T value) {
        Box<T> box = new Box<>();
        box.set(value);
        return box;
    }
}
```

Contrast:

```java
class Container<T> {
    // static T value;               // illegal
    static <U> U identity(U value) { // legal
        return value;
    }
}
```

`U` belongs to the static method and does not depend on the class-level `T` of any `Container` parameterization.

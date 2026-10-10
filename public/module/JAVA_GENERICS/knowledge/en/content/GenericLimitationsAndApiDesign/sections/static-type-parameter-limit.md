```java
class Box<T> {
    // static T cached; // compile error
}
```

A static member exists once for the class, while `Box<String>`, `Box<Integer>`, and other parameterizations do not become separate runtime classes with separate static state.

A static method may declare its own type parameter:

```java
class Box<T> {
    static <U> U identity(U value) {
        return value;
    }
}
```

`U` belongs to the method, not to a parameterized `Box` instance.

This is illegal:

```java
static <T> T create() {
    // return new T();
}
```

After erasure, `T` alone does not identify a concrete runtime class that can be instantiated with `new T()`. In addition, declaring `<T>` does not state that every valid type argument provides any particular constructor.

Generic code must receive an **object-creation strategy from outside** rather than guess a constructor. The idea can be expressed using only concepts already learned:

```java
interface Factory<T> {
    T create();
}

static <T> T create(Factory<T> factory) {
    return factory.create();
}
```

The caller decides how to create `T`; the generic method only preserves the type relationship. Shorter lambda-based forms and `Class<T>`/Reflection-based creation belong to later modules.

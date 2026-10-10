A constructor may declare its own type parameter even when the class itself is not generic:

```java
class Message {
    <T> Message(T source) {
        System.out.println(source);
    }
}
```

Here `T` belongs to the **constructor**, not to `Message`.

At the call site:

```java
new Message("java"); // T is inferred as String
new Message(123);    // T is inferred as Integer
```

The caller normally does not need to write the constructor type argument explicitly; the compiler infers it from the argument.

A generic class may also have a constructor with an independent type parameter:

```java
class Box<T> {
    <U> Box(U initialMetadata) {
        // T belongs to the class; U belongs to the constructor
    }
}
```

This is not a pattern you need every day. The important mental model is scope: a class/interface, constructor, or method may own its own type parameters.

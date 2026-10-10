A `MethodHandle` is a **typed, directly executable reference** to a low-level operation such as a method, constructor, field accessor, or composed operation. Think “callable runtime value,” not metadata record.

```java
final class Greeter {
    String greet(String name) {
        return "Hello " + name;
    }
}

MethodHandles.Lookup lookup = MethodHandles.lookup();
MethodType type = MethodType.methodType(String.class, String.class);

MethodHandle greet =
        lookup.findVirtual(
                Greeter.class,
                "greet",
                type
        );
```

`greet.type()` is:

```text
(Greeter, String)String
```

The receiver becomes the **first parameter in the MethodHandle's `MethodType`** for a virtual method. That explains why binding the receiver later produces a new `(String)String` handle.

MethodHandles are immutable. Adapters do not mutate an existing handle; they produce new handles representing new executable pipelines.

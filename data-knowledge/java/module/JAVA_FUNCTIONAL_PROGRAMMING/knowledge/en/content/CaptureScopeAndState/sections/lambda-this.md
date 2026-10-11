Inside a lambda, `this` means the same `this` as in the enclosing context. The lambda does not create a new `this` object of its own.

```java
class Greeter {
    private final String prefix = "Hello";

    Runnable greeting(String name) {
        return () -> System.out.println(this.prefix + " " + name);
    }
}
```

Here `this` refers to the `Greeter` instance.

The same lexical behavior applies to unqualified instance-member access and to `super` where `super` is otherwise legal in the enclosing context. This makes lambdas feel like behavior written directly inside the surrounding method rather than like a nested object with separate identity.

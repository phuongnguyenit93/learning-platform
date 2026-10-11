The functional interface provides more than the fact that "one method exists." Java derives a **function type** from that abstract contract. Conceptually, the function type describes:

- the parameter types accepted by the behavior;
- the result type it must produce, or `void` if there is no result;
- the checked exceptions permitted by the contract.

For example:

```java
@FunctionalInterface
interface Parser<T> {
    T parse(String text) throws IOException;
}
```

The target `Parser<Integer>` describes behavior that accepts a `String`, produces an `Integer`, and may throw `IOException`.

This function type is what later chapters rely on when checking whether a lambda body, method reference, return value, or checked exception is compatible with its target. It is a compiler concept tied to the target interface; Java does not expose a universal standalone `FunctionType` class for it.

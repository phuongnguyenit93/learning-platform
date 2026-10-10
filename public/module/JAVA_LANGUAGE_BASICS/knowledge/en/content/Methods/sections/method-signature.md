For Java overloading, a method signature is primarily its **name + parameter types**. Return type alone cannot distinguish overloads.

Parameters are per-invocation parameter variables that receive copied argument values and are in scope within the method body according to Java's rules. `return` completes the method and supplies a result when the return type is not `void`.

```java
public int add(int left, int right) {
    return left + right;
}
```

Read a method as modifiers → return type → name → parameter list → body. Parameter names and return type alone do not create a distinct overload; overload identity is driven by the method name and parameter types.

### A non-void method must not complete normally without a value

For a method whose return type is not `void`, the compiler must prove that the body **cannot finish normally without returning a value**:

```java
int find(boolean found) {
    if (found) {
        return 1;
    }
    // compile error: this path can reach the end without returning an int
}
```

Make every normal path return a value:

```java
int find(boolean found) {
    if (found) {
        return 1;
    }
    return 0;
}
```

A path ending in `throw` needs no following `return` because that path does not complete normally:

```java
int requireValue(boolean valid) {
    if (!valid) {
        throw new IllegalStateException("invalid");
    }
    return 1;
}
```

This is another form of **compile-time control-flow analysis**, closely related to definite assignment: the compiler reasons about paths rather than guessing runtime intent.

### `return` exits the current method

`return` can provide a result, but it also ends execution of the current method immediately:

```java
if (!valid) {
    return;
}

process(); // runs only when valid
```

Compared with `break` and `continue`, `return` exits a larger boundary: the **entire current method**.

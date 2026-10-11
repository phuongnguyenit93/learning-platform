```java
void log(String... messages) {
    System.out.println(messages.length);
}
```

Inside the body, `messages` has type `String[]`.

Callers can write `log("a", "b")` or pass a compatible array. A varargs parameter must be the final parameter.

Calls such as `log()`, `log("a")`, and `log("a", "b")` are modeled inside the method as arrays of length 0, 1, and 2. A caller may also pass an existing compatible array.

Varargs is therefore call-site convenience built on array semantics, including allocation and mutability considerations.

`log((String[]) null)` is different from `log()`: the former passes a null array reference, while the latter receives an empty array. Public APIs should define whether null arrays are valid.

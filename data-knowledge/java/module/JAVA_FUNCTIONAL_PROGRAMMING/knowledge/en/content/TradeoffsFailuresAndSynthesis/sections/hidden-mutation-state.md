The effectively-final rule applies to a captured local variable's binding. It does not make the referenced object immutable.

```java
List<String> seen = new ArrayList<>();
Consumer<String> remember = value -> seen.add(value);
```

`seen` is not reassigned, so it can be captured. The `ArrayList` itself is still mutated every time `remember` runs.

This distinction matters because captured mutable state creates dependencies that are easy to miss. Results may depend on previous invocations, execution order, or concurrent access. If behavior must keep state, make that state ownership deliberate instead of assuming a lambda makes it harmless.

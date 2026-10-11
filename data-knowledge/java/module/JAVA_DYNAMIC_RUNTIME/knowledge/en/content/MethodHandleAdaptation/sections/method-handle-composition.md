Composition lets multiple small operations become one executable pipeline:

```text
input
 ↓
normalize
 ↓
validate / select
 ↓
business target
 ↓
format result
```

Advantages in runtime/framework code:

- pipelines can be constructed once;
- the final handle has a clear MethodType;
- callers invoke one executable value;
- the typed handle chain gives the JVM optimization opportunities; actual performance still needs measurement on the relevant workload.

But deep composition also increases reasoning and debugging cost. Prefer semantic variable names:

```java
MethodHandle normalizeName = ...;
MethodHandle invokeGreeting = ...;
MethodHandle formatResult = ...;
```

rather than opaque `mh1`, `mh2`, `mh3`.

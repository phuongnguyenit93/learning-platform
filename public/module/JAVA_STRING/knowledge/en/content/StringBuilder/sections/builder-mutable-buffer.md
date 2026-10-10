```java
StringBuilder builder = new StringBuilder();
builder.append("Hello");
builder.append(' ');
builder.append(name);
String result = builder.toString();
```

Unlike String operations, multiple `append` calls mutate the same builder's internal buffer.

That makes it a natural tool for incremental construction inside a controlled scope.

### WHY — what problem does it solve?

String immutability is excellent for sharing but less suitable for building one result through many mutation-like steps:

```text
repeated String concatenation
→ many intermediate immutable values

StringBuilder
→ one mutable construction object
→ append many times
→ toString when complete
```

### Fluent append

Many mutating methods return the builder itself:

```java
String result = new StringBuilder()
        .append("user=")
        .append(userId)
        .append(", active=")
        .append(active)
        .toString();
```

`append` has overloads for primitives, Strings, character sequences, and objects. The builder is a construction tool, not a mutable String value.

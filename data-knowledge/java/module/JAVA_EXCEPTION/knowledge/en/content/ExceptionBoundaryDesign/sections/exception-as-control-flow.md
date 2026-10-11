Exceptions model **abnormal completion**. They should not replace ordinary branches that can be expressed directly.

Harder to read:

```java
try {
    return values.get(index);
} catch (IndexOutOfBoundsException ex) {
    return null;
}
```

when “index does not exist” is actually a normal state the API can check clearly.

Often clearer:

```java
if (index < 0 || index >= values.size()) {
    return null;
}
return values.get(index);
```

### Parsing boundaries can legitimately use exceptions

```java
try {
    return Integer.parseInt(text);
} catch (NumberFormatException ex) {
    return defaultValue;
}
```

Here the parsing API itself reports invalid input via an exception, and a small boundary has a clear fallback policy.

The principle is not “exceptions are slow, therefore never use them”. The first concern is semantics:

```text
normal branch
→ ordinary control structure

abnormal completion
→ exception
```

Performance may matter in a hot path, but readability and contract are the primary design reasons.

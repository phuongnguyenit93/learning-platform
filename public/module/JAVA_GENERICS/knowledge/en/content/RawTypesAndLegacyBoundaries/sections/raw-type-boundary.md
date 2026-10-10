When a legacy API is unavoidable:

```java
static List<String> legacyNames() {
    List raw = LegacyApi.loadNames();
    List<String> result = new ArrayList<>();

    for (Object value : raw) {
        if (!(value instanceof String)) {
            throw new IllegalStateException("Unexpected value: " + value);
        }
        result.add((String) value);
    }

    return result;
}
```

This version validates each element and **copies it into a new `List<String>`**. The rest of the application no longer keeps an alias to the raw list and does not depend on legacy code avoiding later wrong-type mutations.

If performance or identity requirements force a zero-copy boundary such as:

```java
return (List<String>) raw;
```

the cast remains unchecked. That boundary then needs a stronger invariant: not only must the current contents be strings, but **no remaining raw alias may mutate the list with an incompatible value later**. If that cannot be guaranteed, copy/convert is safer.

A safer integration shape is:

```text
legacy/raw source
        ↓
small boundary
        ↓
validate / convert
        ↓
typed application code
```

If a warning is later suppressed, keep the suppression as narrow as possible and document exactly which invariant makes the unchecked operation safe.

Raw types make it clear that much of generic safety is a compile-time mechanism. The next chapter explains the compatibility mechanism underneath it: **type erasure**.

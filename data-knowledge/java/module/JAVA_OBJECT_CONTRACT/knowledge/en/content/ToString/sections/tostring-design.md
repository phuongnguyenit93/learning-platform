A good `toString` is usually:

- concise but informative;
- focused on fields useful for diagnosis;
- deterministic, or at least stable enough for humans to read;
- free of network/database/file I/O;
- cheap enough for logging and debugging;
- unlikely to throw while error handling is already in progress.

### REPRESENTATION IS NOT SERIALIZATION

These goals are different:

```text
toString
→ human-readable diagnostic representation

JSON / protobuf / dedicated serializer
→ machine-readable contract with schema/compatibility policy
```

Do not parse a normal domain object's `toString()` back into the object unless the type **explicitly** documents such a contract. Diagnostic formatting is free to evolve as debugging needs change.

### SHOW USEFUL STATE, NOT THE ENTIRE GRAPH

A `Book` may contain dozens of fields while a diagnostic representation only needs a few:

```java
@Override
public String toString() {
    return "Book[id=" + id + ", title=" + title + "]";
}
```

Dumping a large object graph can make logs noisy, expensive, and hard to read.

### WATCH FOR RECURSIVE OBJECT GRAPHS

If two objects refer to each other and both `toString` methods print the full nested object, representation can recurse forever or become enormous:

```text
Parent.toString()
→ prints Child
   → Child.toString()
      → prints Parent again
         → ...
```

Choose representation fields deliberately instead of blindly printing the full graph.

### RECORDS AND GENERATED REPRESENTATION

Java records generate a component-based `toString`. That is convenient for value carriers, but security and logging boundaries still apply. Generated output is not automatically safe to expose everywhere.

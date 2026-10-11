Interning can reduce duplicate identities for a highly repetitive String set, but it is not a default optimization for all applications.

Consider lookup/canonicalization cost, String-table size/management cost, high-cardinality input, memory pressure, and unnecessary identity coupling.

### High-cardinality and untrusted input

If values are almost always unique:

```text
user-000001
user-000002
user-000003
...
```

canonicalization may provide little deduplication while still adding lookup cost and pressure on the runtime structure that manages interned strings.

Avoid interning high-cardinality user-controlled data merely because it sounds memory-efficient.

### Avoid old JVM folklore

Statements such as “interned strings always live in PermGen” or “an interned String is guaranteed to remain retained until JVM shutdown” are not Java language contracts. Storage location, table structure, and garbage-collection behavior are JVM implementation details.

Reason in terms of:

```text
canonical identity
lookup cost
String-table/memory profile
workload cardinality
```

Intern when the workload and measurements justify it, or when canonical identity is genuinely part of the design.

The next chapter leaves reference identity behind and establishes the Unicode model inside a String: how do `char`, Unicode code points, and user-perceived characters differ? Only after that does the module cross the text/byte boundary through Charset.

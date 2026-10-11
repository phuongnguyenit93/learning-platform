The JVMS intentionally does not prescribe the physical representation of objects. A JVM implementation can choose headers, alignment, field placement, compressed references, and other details as long as observable semantics remain correct.

HotSpot commonly uses object headers and alignment rules, but exact sizes depend on JVM version, architecture, and configuration.

Therefore a claim such as:

```text
every Java object = X-byte header + fields
```

is only meaningful inside a specific implementation context.

For precise memory-sizing discussions, state the JVM/version, architecture, compressed-reference settings, and alignment assumptions.

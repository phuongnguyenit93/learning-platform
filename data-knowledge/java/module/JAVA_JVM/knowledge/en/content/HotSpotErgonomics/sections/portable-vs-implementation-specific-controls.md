Portable behavior is semantics guaranteed by Java/JVM specifications. Implementation-specific controls change how one runtime achieves those semantics.

For example:

```text
object-allocation semantics
→ JVM contract

-XX:+UseG1GC
→ HotSpot control

frame semantics
→ JVM contract

code-cache sizing flag
→ HotSpot implementation control
```

Application correctness should not require an implementation-specific performance flag. VM options should influence performance/operations, not redefine program correctness.

If correctness relies on undocumented VM behavior, the design is fragile across JDK versions and vendors.

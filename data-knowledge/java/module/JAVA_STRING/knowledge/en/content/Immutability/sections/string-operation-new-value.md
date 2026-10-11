Use the returned result when an operation transforms text:

```java
String s = " java ";
s.trim();       // result ignored
s = s.trim();   // s now refers to "java"
```

The variable can be reassigned even though each String object is immutable.

### A result value does not guarantee a distinct new object

Application code should not assume every String method must allocate another object. A method may return the same instance when no content change is required, and the compiler/runtime may optimize construction.

Depend on:

```text
the old String content is not mutated
+
the method returns a String representing the result
```

Do not use identity to validate text:

```text
result == s
→ identity question

result.equals(s)
→ content question
```

The next chapter uses immutability to explain safe literal sharing in the String pool.

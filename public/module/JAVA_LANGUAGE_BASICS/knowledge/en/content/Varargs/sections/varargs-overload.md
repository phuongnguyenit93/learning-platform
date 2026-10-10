Varargs is normally considered after suitable fixed-arity candidates.

Adding a varargs overload can therefore change an overload set in non-obvious ways when combined with widening, boxing, and `null`.

Public overload sets that mix varargs with related reference types deserve representative call-site tests.

Fixed arity normally wins first:

```java
void send(String value) { }
void send(String... values) { }
send("one"); // fixed-arity overload
```

`null`, boxing, and related reference types can make overload sets surprisingly ambiguous, so convenience overloads should not obscure call semantics.

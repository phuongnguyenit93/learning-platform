A useful mental model is:

```text
1. fixed arity without boxing/varargs fallback
        ↓ if needed
2. applicable boxing/unboxing conversions
        ↓ if still needed
3. varargs fallback
```

The language specification is more detailed, but this ordering explains many “widening vs boxing vs varargs” questions.

```java
void pick(long x) { }
void pick(Integer x) { }
void pick(int... x) { }

pick(1); // long overload wins before boxing/varargs fallback
```

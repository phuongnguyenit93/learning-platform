Use `==`/`!=` to ask whether a reference holds null:

```java
boolean absent = user == null;
boolean present = user != null;
```

Calling `user.equals(null)` is the wrong direction because it already dereferences `user` before `equals` executes.

After Control Flow is introduced, these comparisons commonly guard dereference operations. When null-safe object equality is appropriate, `Objects.equals(a, b)` can express that intent clearly, but it should not replace understanding the domain's nullability contract.

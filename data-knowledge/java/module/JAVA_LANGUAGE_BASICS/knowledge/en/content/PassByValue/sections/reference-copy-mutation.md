```java
void rename(User user) {
    user.setName("B");
}
```

The caller observes the mutation because both references point to the same `User` object.

This does **not** make Java pass-by-reference: the method did not receive the caller's variable slot, only a copied reference value.

Arrays behave the same way:

```java
void changeFirst(int[] values) {
    values[0] = 99;
}
```

The caller sees the changed element because both references identify the same array object. That is shared mutation through aliases, not pass-by-reference.

With immutable objects, reassignment is easier to notice:

```java
void append(String text) {
    text = text + "!";
}
```

The caller's variable does not change because the parameter is reassigned to another value/object.

Repeated `result += part` in a large loop may create repeated intermediate work and copies:

```java
String[] parts = {"java", "-", "core"};
String result = "";
for (String part : parts) {
    result += part;
}
```

Mental model:

```text
""
 + part1 → result 1
 + part2 → larger result 2
 + part3 → larger result 3
 ...
```

As the result grows, the same prefix may be copied repeatedly. For sufficiently large workloads, this creates substantially more copying than reusing one mutable buffer.

When building text incrementally through many steps, `StringBuilder` usually expresses the intent more clearly and efficiently.

This does **not** mean every `+` is bad:

```java
String fullName = firstName + " " + lastName;
```

A small, readable expression is usually best left simple. Builder matters most for **incremental** construction, especially in loops or many branches.

The next chapter introduces that mutable buffer explicitly.

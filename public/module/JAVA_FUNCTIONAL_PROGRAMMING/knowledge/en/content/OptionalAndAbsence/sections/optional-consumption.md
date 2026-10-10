When you need to perform an action only if a value exists, `ifPresent` expresses that directly.

```java
user.ifPresent(found -> audit.log("Found " + found.id()));
```

When both cases need actions, `ifPresentOrElse` keeps the two branches together.

```java
user.ifPresentOrElse(
        this::displayUser,
        () -> displayMessage("User not found")
);
```

These methods are appropriate for terminal actions. If you still need a value for further computation, prefer transformation or fallback methods rather than using mutable holders inside `ifPresent`.

`ifPresentOrElse` was added after the original Java 8 `Optional` API, in Java 9. This Java Core module teaches the current stable API; the Java 8 feature module remains the place for release-specific introduction context.

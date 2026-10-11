`values()` returns constants in declaration order. `valueOf(String)` resolves an exact constant name.

```java
AccountStatus[] all = AccountStatus.values();
AccountStatus status = AccountStatus.valueOf("ACTIVE");
```

`name()` is the declared identifier. `ordinal()` is only the declaration position and should **not** be used as a persistent business/database code because reordering constants changes it.

Use an explicit field for stable external identifiers.

Next we ask what “copying an object” actually means.

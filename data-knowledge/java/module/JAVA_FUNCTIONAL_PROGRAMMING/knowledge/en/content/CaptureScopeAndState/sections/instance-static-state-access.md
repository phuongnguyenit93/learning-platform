The effectively-final restriction is about captured local variables. Instance fields and static fields follow normal Java field-access rules and may be read or changed from a lambda when they are otherwise accessible.

```java
class Counter {
    private int count;
    private static int total;

    Runnable increment = () -> {
        count++;
        total++;
    };
}
```

`count` and `total` are fields, so they are not captured local variables and are not subject to the effectively-final rule.

That does **not** make field mutation automatically safe. If the lambda can run concurrently, normal Java memory-model and synchronization concerns still apply. Lambdas do not add thread safety to mutable state.

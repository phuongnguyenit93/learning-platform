The module uses:

```java
@DeclareParents(
    value = "...IntroductionTargetService",
    defaultImpl = DefaultUsageTracked.class
)
public static UsageTracked usageTracked;
```

`DefaultUsageTracked` provides the implementation for the introduced interface.

The experiment intentionally matches the **exact target type** instead of using a broad type pattern. In a learning module, a narrow boundary keeps behavior predictable and avoids pulling unrelated beans into type matching.

Introduction is an advanced capability and is less common than logging or timing. It is more useful for understanding the power of the proxy/advisor model than as a pattern that every application should use frequently.

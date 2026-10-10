Module dùng:

```java
@DeclareParents(
    value = "...IntroductionTargetService",
    defaultImpl = DefaultUsageTracked.class
)
public static UsageTracked usageTracked;
```

`DefaultUsageTracked` cung cấp implementation cho interface được introduction.

Experiment cố ý match **exact target type** thay vì một type pattern rộng. Với learning module, boundary hẹp giúp behavior dễ dự đoán và tránh đưa các bean không liên quan vào quá trình type matching.

Introduction là capability nâng cao và ít gặp hơn logging/timing. Nó phù hợp để hiểu sức mạnh của proxy/advisor model hơn là một pattern phải dùng thường xuyên.

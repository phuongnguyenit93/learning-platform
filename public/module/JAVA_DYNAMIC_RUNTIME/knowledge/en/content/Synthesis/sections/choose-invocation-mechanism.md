A useful decision rule:

```text
Target is known and an ordinary Java call works?
→ direct call

Need runtime metadata/member/annotation inspection?
→ Reflection

Need a typed executable reference,
adaptable/composable pipeline,
or runtime linkage primitive?
→ MethodHandle / java.lang.invoke
```

Do not introduce MethodHandle just to replace a normal call:

```java
service.process(request);
```

is still better than a lookup/invoke pipeline when no runtime requirement justifies the added complexity.

MethodHandle often makes sense in frameworks, runtimes, serializers, dynamic-language support, FFM plumbing, or generated dispatch layers where representing behavior as an executable value is part of the design.

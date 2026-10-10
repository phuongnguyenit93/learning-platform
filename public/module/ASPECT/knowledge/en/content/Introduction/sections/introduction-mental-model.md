Original target:

```text
IntroductionTargetService
→ does not implement UsageTracked
```

After the introduction is applied:

```text
Spring AOP Proxy
├── behavior of IntroductionTargetService
└── UsageTracked
```

The caller sees a proxy with a broader capability than the original target class.

This does not modify the target class bytecode. The new capability exists on the **proxy type surface**.

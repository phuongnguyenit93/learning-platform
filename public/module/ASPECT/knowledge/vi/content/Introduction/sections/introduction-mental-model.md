Target ban đầu:

```text
IntroductionTargetService
→ không implements UsageTracked
```

Sau khi introduction được apply:

```text
Spring AOP Proxy
├── behavior của IntroductionTargetService
└── UsageTracked
```

Caller nhìn proxy có capability rộng hơn target class gốc.

Đây không phải sửa bytecode của target class. Capability mới nằm trên **proxy type surface**.

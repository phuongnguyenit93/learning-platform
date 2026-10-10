Plugin system cần policy rõ cho dependency direction.

Một layout thường an toàn:

```text
host
  ↓
contract/api module
  ↑
plugin A     plugin B
```

Contract module nên nhỏ, ổn định và chứa type thật sự cần share.

Plugin-specific library nên ở phía plugin nếu host không cần biết. Chia sẻ quá nhiều dependency làm tăng nguy cơ version conflict và class-identity coupling.

Tránh dependency vòng:

```text
host → plugin
plugin → host implementation
```

Nếu plugin cần host service, hãy expose capability đó qua một **host-facing contract/context** ổn định thay vì để plugin import implementation package.

Ví dụ:

```java
interface PluginContext {
    Logger logger();
    Path dataDirectory();
}
```

Policy dependency là nền tảng cho isolation và compatibility ở các chapter tiếp theo.

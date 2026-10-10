Giả sử target có:

```java
public void outer() {
    inner();
}

@TrackExecution("inner")
public void inner() {
}
```

External call:

```text
Controller
→ Proxy
→ inner()
```

Advice có cơ hội chạy.

Self-invocation:

```text
Controller
→ Proxy
→ outer()
      ↓
   this.inner()
```

Lời gọi `inner()` diễn ra trực tiếp trên target object hiện tại và không quay ra proxy lần thứ hai.

Vì vậy **có annotation không đồng nghĩa advice chắc chắn chạy**.

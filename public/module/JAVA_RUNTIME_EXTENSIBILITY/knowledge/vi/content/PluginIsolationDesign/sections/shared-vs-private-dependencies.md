Dependency nên được chia thành hai nhóm:

```text
shared
→ contract/API + library cần interoperability thật sự

private
→ thư viện triển khai chỉ plugin đó cần
```

Share quá nhiều dependency làm plugin mất isolation. Share quá ít có thể tạo duplicate type identity cho object phải truyền qua boundary.

Ví dụ không nên để DTO qua contract thuộc library mà mỗi plugin load version riêng nếu object cần cast/serialize bằng type JVM cụ thể.

Một policy thường gặp:

- JDK types và contract API: shared;
- logging façade/context do host cung cấp: shared khi contract yêu cầu;
- parser/rendering/native client riêng: private;
- transitive implementation dependencies: private mặc định.

Boundary càng nhỏ, compatibility surface càng dễ kiểm soát.

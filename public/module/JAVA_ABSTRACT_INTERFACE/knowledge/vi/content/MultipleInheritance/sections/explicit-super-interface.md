Khi lớp phải override để giải quyết xung đột, nó có thể gọi tường minh phương thức `default` của **interface cha trực tiếp**:

```java
@Override
public String name() {
    return A.super.name() + B.super.name();
}
```

`InterfaceName.super.method()` cho phép lớp kết hợp hành vi mặc định thay vì phải viết lại toàn bộ.

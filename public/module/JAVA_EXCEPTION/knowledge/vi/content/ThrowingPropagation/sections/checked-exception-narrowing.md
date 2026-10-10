Override có thể:

```text
giữ nguyên checked exception
→ throws IOException

thu hẹp thành subtype
→ throws FileNotFoundException

bỏ checked exception
→ không có throws
```

Ví dụ hợp lệ:

```java
class Child extends Parent {
    @Override
    void load() throws FileNotFoundException {
    }
}
```

hoặc:

```java
class InMemoryChild extends Parent {
    @Override
    void load() {
    }
}
```

`Child` cam kết một hợp đồng bằng hoặc dễ xử lý hơn đối với checked exception.

### GHI NHỚ

```text
throw
→ hành động khi chương trình chạy

throws
→ hợp đồng khai báo

ghi đè (override)
→ không được mở rộng hợp đồng checked exception

precise rethrow
→ `catch` rộng không nhất thiết làm `throws` bị rộng
```

Chương tiếp theo đi vào nơi quá trình lan truyền bị chặn: `try`, `catch` và `finally` phối hợp thế nào trên từng đường chạy?

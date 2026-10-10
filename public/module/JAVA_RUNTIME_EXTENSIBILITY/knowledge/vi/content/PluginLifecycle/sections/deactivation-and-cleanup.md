Deactivation cần trả lời: khi nào plugin ngừng nhận work mới và ai đóng tài nguyên?

Flow thường là:

```text
mark unavailable
→ stop new requests
→ wait/cancel in-flight work
→ invoke plugin stop/close
→ release references/resources
```

`AutoCloseable` có thể là contract phù hợp nếu semantics đơn giản:

```java
public interface ManagedExporter extends ReportExporter, AutoCloseable {
    @Override
    void close();
}
```

Nhưng lifecycle không nhất thiết phải map vào `close()` nếu plugin có nhiều phase.

Quyền sở hữu tài nguyên phải rõ ràng. Nếu host cấp executor cho plugin, host thường đóng executor. Nếu plugin tự tạo scheduler, plugin phải dừng nó. Không rõ ownership là nguồn leak rất phổ biến.

Cleanup nên chạy cả khi initialization chỉ thành công một phần; vì vậy code lifecycle cần xử lý rollback/trạng thái chưa hoàn chỉnh.

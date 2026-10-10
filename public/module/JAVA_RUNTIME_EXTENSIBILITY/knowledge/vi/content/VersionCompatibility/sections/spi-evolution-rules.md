SPI evolution nên ưu tiên thay đổi mà provider cũ vẫn có thể hoạt động hợp lý.

Để cô lập bài toán evolution, ví dụ sau dùng một **biến thể rút gọn** của `ReportExporter` rồi thêm capability tùy chọn có hành vi mặc định hợp lý; đây là evolution sketch, không phải signature hiện tại của running example:

```java
public interface ReportExporter {
    void export(Report report);

    default boolean supportsStreaming() {
        return false;
    }
}
```

Default method có thể giảm source/binary disruption, nhưng chỉ dùng khi default semantic thật sự đúng. Một default “giả” có thể che lỗi compatibility.

Các strategy khác:

- thêm interface capability riêng (`StreamingExporter`);
- thêm method vào version mới của SPI và support song song hai contract trong giai đoạn migration;
- giữ DTO backward-compatible;
- deprecate trước khi remove;
- tránh thay đổi exception/`null` semantics âm thầm.

Đừng ép kiểu về class triển khai để “mở rộng” SPI ngoài contract. Nếu capability mới đủ quan trọng cho host, hãy biểu diễn nó rõ ràng trong contract.

Mọi evolution rule nên được contract test với provider cũ, không chỉ dựa vào code review.

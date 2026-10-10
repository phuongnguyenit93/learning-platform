Có ba trường hợp cần phân biệt.

### Trường hợp 1 — Phần thân thành công, đóng tài nguyên thất bại

```text
phần thân thành công
→ close() ném B
→ B trở thành lỗi chính
```

Thao tác cuối cùng vẫn thất bại vì tài nguyên không được đóng thành công theo hợp đồng.

### Trường hợp 2 — Phần thân thất bại, đóng tài nguyên cũng thất bại

```text
phần thân ném A
→ close() ném B
→ A là lỗi chính
→ B được suppressed trên A
```

### Trường hợp 3 — Nhiều lần đóng cùng thất bại, phần thân thành công

Với:

```text
A mở trước
B mở sau
```

thứ tự đóng:

```text
B → A
```

Nếu cả hai `close()` đều ném exception:

```text
lỗi khi đóng B
→ lỗi đóng tài nguyên chính

lỗi khi đóng A
→ được suppressed trên lỗi của B
```

Lỗi đầu tiên xuất hiện trong quá trình đóng trở thành kết quả chính; các lỗi đóng tiếp theo được giữ dưới dạng suppressed.

### Dọn dẹp thủ công dễ sai ở đâu?

```java
try {
    use();
} finally {
    close(); // nếu throw, có thể che exception từ use()
}
```

Tự tái tạo đúng quy tắc của TWR với nhiều tài nguyên, khởi tạo một phần và nhiều lỗi khi đóng là không đơn giản.

Đó là lý do suppression không phải một chi tiết “lạ” của API; nó tồn tại để giải quyết bài toán bảo toàn thông tin lỗi rất cụ thể.

### GHI NHỚ

```text
cause
→ chuỗi nguyên nhân / chuyển đổi exception

suppressed
→ lỗi phụ được giữ lại để không che lỗi chính

try-with-resources
→ tự quản lý suppression cho các lỗi dọn dẹp
```

Trước khi rời chủ đề try-with-resources, phần cuối xem một tiện ích cú pháp từ Java 9: dùng trực tiếp một biến `final` hoặc effectively final làm tài nguyên.

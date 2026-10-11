Unchecked exception không chịu quy tắc bắt-hoặc-khai-báo.

Hai nhóm chính:

```text
RuntimeException và các lớp con
Error và các lớp con
```

Trong mã nguồn ứng dụng, khi nói “unchecked exception” ta thường gặp nhánh `RuntimeException`:

- `NullPointerException`;
- `IllegalArgumentException`;
- `IllegalStateException`;
- `IndexOutOfBoundsException`.

Ví dụ:

```java
void withdraw(long amount) {
    if (amount < 0) {
        throw new IllegalArgumentException("amount must be >= 0");
    }
}
```

Phương thức không bắt buộc phải viết:

```java
void withdraw(long amount) throws IllegalArgumentException
```

Dù khai báo unchecked exception trong `throws` là **hợp lệ về cú pháp**, trình biên dịch không yêu cầu làm vậy.

### Unchecked không có nghĩa là “không cần xử lý”

Unchecked chỉ nói:

```text
trình biên dịch
→ không ép bên gọi bắt hoặc khai báo
```

Nó không nói:

```text
khi chương trình chạy
→ lỗi không quan trọng
```

`NullPointerException` vẫn có thể làm một yêu cầu hoặc tác vụ thất bại. Điểm khác biệt là API không bắt mọi bên gọi thể hiện quyết định đó bằng cú pháp checked exception.

Unchecked exception thường phù hợp khi lỗi liên quan tới:

- vi phạm điều kiện đầu vào (precondition);
- trạng thái đối tượng không hợp lệ;
- lỗi lập trình;
- lỗi mà bên gọi gần đó không có chiến lược phục hồi hợp lý.

Khi Java gặp một `try` có nhiều `catch`, nó xét các khối `catch` theo thứ tự xuất hiện và chọn khối đầu tiên có kiểu tham số nhận được exception đang được ném.

```java
try {
    load();
} catch (FileNotFoundException ex) {
    handleMissingFile(ex);
} catch (IOException ex) {
    handleOtherIo(ex);
}
```

`FileNotFoundException` là kiểu con (subtype) của `IOException`, nên nhánh cụ thể phải đứng trước nhánh rộng.

Đoạn này không hợp lệ:

```java
try {
    load();
} catch (IOException ex) {
    handleIo(ex);
} catch (FileNotFoundException ex) { // unreachable
    handleMissingFile(ex);
}
```

Trình biên dịch biết mọi `FileNotFoundException` đã bị `catch (IOException)` phía trên bắt mất.

### Kiểu quan trọng hơn thông điệp

Không nên chọn cách xử lý bằng cách phân tích chuỗi thông điệp:

```java
catch (IOException ex) {
    if (ex.getMessage().contains("not found")) {
        ...
    }
}
```

Thông điệp dành cho chẩn đoán và có thể thay đổi. Nếu bên gọi cần chính sách xử lý khác nhau, **kiểu exception hoặc ngữ cảnh có cấu trúc** thường là hợp đồng tốt hơn.

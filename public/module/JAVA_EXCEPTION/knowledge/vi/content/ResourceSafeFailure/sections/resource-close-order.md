Tài nguyên được khởi tạo từ trái sang phải:

```java
try (A a = openA();
     B b = openB();
     C c = openC()) {
    use(a, b, c);
}
```

Thứ tự khởi tạo:

```text
A → B → C
```

Đóng theo thứ tự ngược:

```text
C → B → A
```

### VÌ SAO ĐÓNG NGƯỢC?

Tài nguyên tạo sau thường phụ thuộc tài nguyên tạo trước.

Ví dụ một tài nguyên bọc tài nguyên khác:

```java
try (InputStream raw = Files.newInputStream(path);
     BufferedInputStream buffered = new BufferedInputStream(raw)) {
    ...
}
```

`buffered` bọc `raw`, nên đối tượng bọc được đóng trước. Tuy nhiên, nhiều đối tượng bọc cũng tự đóng tài nguyên bên trong khi `close()`; việc có khai báo cả hai tài nguyên trong cùng try-with-resources hay không phải dựa trên **quyền sở hữu thực tế** để tránh đóng lặp một tài nguyên không thuộc trách nhiệm của mình.

### Nếu khởi tạo tài nguyên ở giữa bị thất bại?

Đây là trường hợp biên quan trọng.

```java
try (A a = openA();
     B b = openB();   // throw tại đây
     C c = openC()) {
    ...
}
```

Kết quả:

```text
A đã tạo thành công
B khởi tạo thất bại
C chưa bao giờ được tạo
        ↓
A vẫn được đóng
```

TWR chịu trách nhiệm dọn dẹp những tài nguyên đã khởi tạo thành công trước điểm thất bại. Nếu việc khởi tạo B đã ném exception và `A.close()` cũng ném exception, lỗi khởi tạo B vẫn là lỗi chính còn lỗi từ `A.close()` được giữ dưới dạng suppressed exception.

Một chi tiết quan trọng: nếu `openB()` đã tự cấp phát một tài nguyên nội bộ rồi thất bại **trước khi trả về đối tượng B**, TWR chưa bao giờ nhận quyền sở hữu B nên không thể gọi `B.close()`. Phần mã đang khởi tạo B phải tự dọn những tài nguyên nó đã cấp phát trước khi ném lỗi.

Điều này khó viết đúng nếu tự quản lý nhiều `try/finally` lồng nhau.

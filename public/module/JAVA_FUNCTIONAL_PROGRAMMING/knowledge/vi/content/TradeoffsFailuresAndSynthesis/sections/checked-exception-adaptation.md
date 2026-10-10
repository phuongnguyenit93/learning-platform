Khi mã theo phong cách hàm gặp ngoại lệ được kiểm tra, nên chọn cách xử lý phù hợp với ranh giới API thay vì che lỗi bằng một thủ thuật chung.

Một lựa chọn là chuyển ngoại lệ được kiểm tra thành ngoại lệ không được kiểm tra phù hợp:

```java
Function<Path, String> reader = path -> {
    try {
        return Files.readString(path);
    } catch (IOException ex) {
        throw new UncheckedIOException(ex);
    }
};
```

Một lựa chọn khác là tạo giao diện hàm theo miền sử dụng và cho phép hợp đồng khai báo ngoại lệ được kiểm tra:

```java
@FunctionalInterface
interface IOFunction<T, R> {
    R apply(T value) throws IOException;
}
```

Cũng có thể giữ thao tác trong phương thức thông thường nếu cách xử lý ngoại lệ ở đó rõ ràng hơn. Nên tránh các hàm hỗ trợ dùng thủ thuật ném lén ngoại lệ ("sneaky throw") vì chúng che khuất ngoại lệ được kiểm tra; lúc đó kiểu khai báo cho người gọi thấy một mô hình lỗi khác với hành vi thật sự.

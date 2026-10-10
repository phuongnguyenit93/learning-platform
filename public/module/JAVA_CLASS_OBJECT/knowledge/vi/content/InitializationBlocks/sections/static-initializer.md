Khối khởi tạo `static`:

```java
static {
    ...
}
```

chạy khi lớp được khởi tạo, không phải mỗi lần tạo đối tượng.

Nó có thể phù hợp cho việc thiết lập trạng thái `static` không biểu diễn thuận tiện bằng một biểu thức, nhưng logic phức tạp hoặc I/O trong quá trình khởi tạo lớp làm việc khởi động và xử lý lỗi khó kiểm soát.

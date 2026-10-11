Giao diện hàm không chỉ nói rằng "có một phương thức trừu tượng". Từ hợp đồng đó, Java xác định **kiểu hàm (function type)** dùng để kiểm tra lambda hoặc tham chiếu phương thức.

Về mặt khái niệm, kiểu hàm mô tả:

- các kiểu tham số mà hành vi nhận vào;
- kiểu kết quả phải tạo ra, hoặc `void` nếu không trả kết quả;
- các ngoại lệ được kiểm tra (checked exception) mà hợp đồng cho phép truyền tiếp.

Ví dụ:

```java
@FunctionalInterface
interface Parser<T> {
    T parse(String text) throws IOException;
}
```

Với kiểu đích `Parser<Integer>`, hành vi tương ứng nhận `String`, tạo ra `Integer` và có thể ném `IOException`.

Khái niệm này sẽ được dùng lại ở các chương sau khi kiểm tra kiểu tham số, giá trị trả về, tham chiếu phương thức và ngoại lệ được kiểm tra. Đây là khái niệm của trình biên dịch gắn với giao diện hàm; Java không cung cấp một lớp chung tên `FunctionType` để lập trình viên tự tạo và truyền đi.

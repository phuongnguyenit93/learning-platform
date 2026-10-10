Bản thân một `Optional` thông thường nên khác `null`. Nếu một phương thức trả về `null` thay vì `Optional.empty()`, người gọi lại phải xử lý hai dạng "không có giá trị", làm mất ý nghĩa của hợp đồng `Optional`.

`Optional` cũng quy định rõ cách `null` tương tác với phép biến đổi:

- `map` biến kết quả `null` của hàm ánh xạ thành `Optional.empty()`;
- `flatMap` yêu cầu hàm ánh xạ trả về một `Optional` khác `null` và sẽ ném `NullPointerException` nếu hàm ánh xạ trả về `null`.

```java
Optional<String> name = Optional.of("Java");
Optional<Integer> length = name.map(String::length);
```

Ở ranh giới với API cũ có thể trả về `null`, `ofNullable` thường là cầu nối phù hợp để đi vào luồng xử lý dùng `Optional`.

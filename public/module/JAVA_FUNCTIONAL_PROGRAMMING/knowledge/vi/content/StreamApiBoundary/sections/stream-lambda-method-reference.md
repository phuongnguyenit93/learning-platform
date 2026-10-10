Trong mã dùng Stream, giao diện hàm thường xuất hiện thông qua cú pháp lambda hoặc tham chiếu phương thức.

```java
names.stream()
        .filter(name -> !name.isBlank())
        .map(String::trim);
```

Ở đây lambda có thể đáp ứng `Predicate<String>`, còn `String::trim` có thể đáp ứng hàm biến đổi mà `map` yêu cầu.

Ví dụ này chỉ nhằm chứng minh mối liên hệ: **phương thức Stream -> tham số giao diện hàm -> lambda/tham chiếu phương thức**. Ngữ nghĩa của chuỗi xử lý Stream thuộc mô-đun Stream API.

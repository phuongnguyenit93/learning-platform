Lambda là biểu thức **được xác định kiểu theo ngữ cảnh (target typed)**. Trình biên dịch dùng giao diện hàm mà ngữ cảnh đang yêu cầu để hiểu lambda.

```java
Predicate<String> rule = text -> text.length() > 3;
```

Từ `Predicate<String>`, trình biên dịch biết `text` là `String` và thân lambda phải tương thích với kết quả `boolean`.

Cùng một đoạn lambda có thể mang các kiểu khác nhau nếu kiểu đích khác nhau:

```java
Callable<String> first = () -> "done";
Supplier<String> second = () -> "done";
```

Thân lambda giống nhau, nhưng hai biến có kiểu Java và hợp đồng API khác nhau.

Vì việc xác định kiểu theo ngữ cảnh (target typing) là bắt buộc, lambda thường không thể đứng độc lập khi không có ngữ cảnh xác định một giao diện hàm phù hợp.

Thân lambda phải phù hợp với kiểu kết quả mà kiểu hàm đích yêu cầu.

Với hợp đồng có trả giá trị, thân dạng biểu thức phải tạo ra giá trị tương thích. Xét riêng về cấu trúc, thân dạng khối **tương thích với việc trả giá trị (value-compatible)** khi nó không thể kết thúc bình thường và mọi câu lệnh `return` trong khối đều có dạng `return biểu_thức;`. Khi khớp với một kiểu kết quả đích cụ thể, từng biểu thức kết quả đó còn phải tương thích với kiểu đích:

```java
Function<String, Integer> length = text -> text.length();

Function<String, Integer> parsedLength = text -> {
    String trimmed = text.trim();
    return trimmed.length();
};

Supplier<String> alwaysFails = () -> {
    throw new IllegalStateException("failed");
};
```

Khối `alwaysFails` vẫn hợp lệ với kiểu đích có trả giá trị dù không bao giờ đi tới `return`, vì khối này không thể kết thúc bình thường mà luôn ném ngoại lệ.

Với hợp đồng trả `void`, thân dạng khối không trả về giá trị. Thân dạng biểu thức cũng có thể là một **biểu thức được phép dùng như câu lệnh (statement expression)**; nếu biểu thức đó tạo ra giá trị thì kết quả sẽ bị bỏ qua:

```java
Consumer<String> printer = text -> System.out.println(text);
Consumer<String> trimAndDiscard = text -> text.trim();

Consumer<String> normalizedPrinter = text -> {
    String normalized = text.trim();
    System.out.println(normalized);
};
```

Ở ví dụ `text.trim()`, phương thức trả về `String` nhưng kết quả bị bỏ qua vì kiểu hàm đích trả `void`. Điều này không có nghĩa mọi biểu thức tạo giá trị đều tương thích với `void`; Java áp dụng quy tắc riêng cho statement expression.

Lambda dạng khối vẫn phải tuân theo quy tắc về khả năng đi tới câu lệnh (reachability) và `return` của Java. Nếu kiểu đích yêu cầu một giá trị, khối không được kết thúc bình thường bằng cách đi tới dấu `}` cuối cùng.

Ngoại lệ được kiểm tra (checked exception) cũng bị giới hạn bởi kiểu hàm đích; phần đó sẽ được xử lý ở chương tổng hợp cuối mô-đun.

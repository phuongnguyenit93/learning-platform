Bản thân một lambda chưa cung cấp đủ thông tin để xác định toàn bộ kiểu Java của nó. Ngữ cảnh xung quanh phải cung cấp **kiểu đích**, và kiểu đích đó phải là một giao diện hàm tương thích.

```java
Predicate<String> nonEmpty = text -> !text.isEmpty();
Function<String, Integer> length = text -> text.length();
```

Hai lambda đều có một tham số nhưng đại diện cho hai hợp đồng khác nhau:

- `Predicate<String>` nhận `String` và trả về `boolean`;
- `Function<String, Integer>` nhận `String` và tạo ra `Integer`.

Giao diện hàm vì thế là cầu nối giữa API Java thông thường và cú pháp hành vi ngắn gọn. Nó cho trình biên dịch biết kiểu tham số, yêu cầu về kết quả và hợp đồng ngoại lệ được kiểm tra mà lambda hoặc tham chiếu phương thức phải tuân theo.

Chương 2 sẽ đi sâu vào hợp đồng này trước khi Chương 3 áp dụng nó cho cơ chế xác định kiểu đích của lambda.

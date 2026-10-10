Khi kiểu hàm đích có giá trị trả về, phương thức được tham chiếu phải tạo ra kết quả tương thích. Khi kiểu đích trả về `void`, Java có thể gọi một phương thức tương thích rồi bỏ qua kết quả của nó.

```java
Function<String, String> trimAndKeep = String::trim;
Consumer<String> trimAndDiscard = String::trim;
```

Cả hai đều có thể gọi `String.trim()`. `Function` giữ lại `String` được trả về, còn `Consumer` bỏ qua nó.

Việc bỏ kết quả có thể hợp lệ về mặt ngôn ngữ nhưng vẫn gây khó hiểu. Nếu một `Consumer` gọi phương thức có giá trị trả về, người đọc có thể tưởng kết quả bị bỏ quên; chỉ nên dùng khi việc gọi hoặc tác dụng phụ của phương thức mới là mục đích rõ ràng.

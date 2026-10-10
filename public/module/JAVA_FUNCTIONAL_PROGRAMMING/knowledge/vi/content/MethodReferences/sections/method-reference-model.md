Tham chiếu phương thức là cách viết ngắn gọn để mô tả một hành vi đã tồn tại dưới dạng phương thức hoặc hàm tạo. Nó giữ cùng vai trò với lambda trong ngữ cảnh có kiểu đích: Java vẫn cần một giao diện hàm để biết hợp đồng tham số và kết quả.

Có thể hiểu đơn giản là **"dùng thao tác đã có này để thực hiện hợp đồng hàm kia"**. Việc viết tham chiếu chưa gọi phương thức ngay lập tức.

```java
Function<String, Integer> parse = Integer::parseInt;

int result = parse.apply("42");
```

Lambda tương đương là `text -> Integer.parseInt(text)`. Tham chiếu phương thức chỉ có lợi khi việc bỏ lớp bọc lambda làm ý định dễ đọc hơn.

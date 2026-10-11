`Predicate<T>` mô tả một điều kiện áp dụng lên giá trị kiểu `T`. Kết quả luôn là `boolean`.

```java
Predicate<String> nonEmpty = text -> !text.isEmpty();
Predicate<Integer> adult = age -> age >= 18;

boolean accepted = adult.test(20); // true
```

Phương thức hàm là `boolean test(T value)`.

Dùng `Predicate` khi hành vi trả lời một câu hỏi như "giá trị này có hợp lệ không?", "có khớp không?" hoặc "có nên chấp nhận không?". Đặt tên biến hoặc điều kiện `Predicate` theo ý nghĩa nghiệp vụ thường giúp nơi gọi đọc tự nhiên hơn.

Predicate có thể được kết hợp bằng `and`, `or`, `negate`; phần kết hợp sẽ được xử lý ở chương riêng để chương này tập trung vào việc chọn đúng hợp đồng trước.

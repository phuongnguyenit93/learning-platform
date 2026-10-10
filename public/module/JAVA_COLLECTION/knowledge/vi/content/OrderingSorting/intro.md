# Thứ tự, so sánh và điều hướng

Collection không chỉ trả lời câu hỏi “chứa phần tử nào”, mà nhiều khi còn phải trả lời “các phần tử xuất hiện theo thứ tự nào”. Thứ tự này có thể đến từ cấu trúc dữ liệu, từ thứ tự tự nhiên của phần tử, hoặc từ một quy tắc so sánh do bên gọi cung cấp. Ba nguồn này liên quan với nhau nhưng không đồng nghĩa.

Trong các ví dụ dưới đây, ta dùng một tập `Order` nhỏ để cùng quan sát nhiều kiểu thứ tự:

```java
record Order(long id, long userId, int totalCents) {}

List<Order> orders = new ArrayList<>(List.of(
        new Order(3, 2, 10_000),
        new Order(1, 1, 20_000),
        new Order(2, 3, 10_000)
));
```

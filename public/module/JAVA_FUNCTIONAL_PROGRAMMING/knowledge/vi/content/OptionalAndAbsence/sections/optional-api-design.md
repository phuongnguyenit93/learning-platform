`Optional` phù hợp nhất làm kiểu trả về khi "không tìm thấy kết quả" là khả năng bình thường mà người gọi cần nhìn thấy ngay trong hợp đồng phương thức.

```java
Optional<Order> findOrder(OrderId id);
```

Nó thường ít hữu ích hơn nếu bị dùng cho mọi trường hoặc tham số. Với tham số, đôi khi các phương thức tách biệt, nạp chồng, đối tượng yêu cầu hoặc quy ước có thể nhận null thể hiện miền nghiệp vụ rõ hơn. Với phương thức trả về tập hợp, tập hợp rỗng thường đã diễn đạt tự nhiên "không có phần tử", nên `Optional<List<T>>` thường không cần thiết.

Đây là hướng dẫn thiết kế chứ không phải giới hạn của trình biên dịch. Câu hỏi chính là: `Optional` có làm ý nghĩa của sự vắng mặt rõ hơn cho người gọi hay không?

Truyền một giao diện hàm phù hợp khi phần thay đổi chủ yếu là **một hành vi**: quy tắc so sánh, phép biến đổi, điều kiện kiểm tra, hàm gọi lại hoặc chiến lược có rất ít trạng thái độc lập.

Một khái niệm trừu tượng hướng đối tượng thường rõ hơn khi khái niệm có định danh, nhiều thao tác liên quan, vòng đời hoặc trạng thái đáng kể.

```java
Comparator<Order> ordering = Comparator.comparing(Order::createdAt);
```

Một hành vi đơn lẻ như trên rất hợp với hợp đồng dạng hàm. Ngược lại, một nhà cung cấp thanh toán có các thao tác ủy quyền (authorize), ghi nhận thanh toán (capture), hoàn tiền (refund), thông tin xác thực (credentials) và quy tắc vòng đời thường phù hợp hơn với một hợp đồng đối tượng giàu hành vi.

Java cho phép hai phong cách phối hợp: giao diện hàm vẫn là giao diện, việc đánh giá lambda cho ra một giá trị tham chiếu tới thực thể của kiểu giao diện hàm đích, và mã hướng đối tượng vẫn có thể nhận hành vi làm tham số khi điều đó tăng tính linh hoạt. Java không bảo đảm mỗi lần đánh giá đều cấp phát một đối tượng lambda mới, nên không được suy ra lớp hiện thực hay danh tính đối tượng ổn định từ cơ chế này.

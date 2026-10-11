Java cho phép lambda trong chuỗi kết hợp thay đổi đối tượng, ghi nhật ký (log), gọi cơ sở dữ liệu hoặc thực hiện bất kỳ tác dụng phụ nào. Giao diện hàm không ép hành vi phải thuần túy.

Rủi ro là một chuỗi nhìn giống các phép biến đổi dữ liệu nhưng thực tế lại phụ thuộc vào số lần và thứ tự thực thi.

```java
Function<Order, Order> record = order -> {
    auditService.record(order);
    return order;
};
```

Nếu hàm này được kết hợp hoặc tái sử dụng, `auditService.record` chạy mỗi lần hàm được gọi. Điều đó có thể đúng với yêu cầu, nhưng tác dụng phụ nên thể hiện rõ qua tên và vị trí của hành vi.

Khi có thể, nên ưu tiên phép biến đổi không có tác dụng phụ cho phần logic tái sử dụng. Khi tác dụng phụ là cần thiết, giữ nó rõ ràng và gần ranh giới nơi thao tác bên ngoài thực sự xảy ra.

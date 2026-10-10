Lambda chỉ là cú pháp để thực hiện hợp đồng của một giao diện hàm. Java không bắt buộc phần cài đặt đó phải thuần túy. Lambda có thể thay đổi đối tượng, ghi tệp, cập nhật cơ sở dữ liệu, ghi nhật ký hoặc gọi dịch vụ bên ngoài.

```java
Consumer<Order> publish = order -> eventBus.publish(order);
```

Điều đó có thể hoàn toàn đúng với yêu cầu. Vấn đề xuất hiện khi một lambda *trông giống* phép biến đổi hoặc điều kiện đơn giản nhưng lại thực hiện công việc ẩn mà thời điểm hay số lần chạy có ý nghĩa.

Một quy tắc hữu ích là để tác dụng phụ lộ rõ qua tên và vị trí. Nếu hành vi làm thay đổi trạng thái bên ngoài, người đọc nên nhận ra điều đó mà không phải mở từng lambda để kiểm tra.

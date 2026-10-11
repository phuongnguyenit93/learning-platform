### KHÁI NIỆM — ranh giới là gì?

Ranh giới của một đối tượng là giới hạn giữa:

```text
những gì đối tượng tự chịu trách nhiệm
và
những gì bên ngoài được phép biết hoặc yêu cầu
```

Một ranh giới tốt chỉ công khai những hành vi cần thiết và giữ các chi tiết triển khai ở bên trong.

Ví dụ, đoạn mã bên ngoài nên có thể nói:

```java
checkoutService.checkout(cart);
```

thay vì phải tự làm toàn bộ các bước:

```text
đọc từng trường của ShoppingCart
→ tự tính giá
→ tự kiểm tra loại thanh toán
→ tự cập nhật trạng thái Order
```

Phiên bản đầu giúp bên gọi chỉ cần biết **ý định cần thực hiện**. Phiên bản sau buộc bên gọi phải biết quá nhiều chi tiết.

### VÌ SAO — ranh giới trách nhiệm quan trọng?

Khi dữ liệu và quy tắc liên quan được đặt cùng một nơi, ta dễ biết phải tìm logic ở đâu. Đây là **độ gắn kết nội bộ (cohesion)** tốt.

Ngược lại, nếu nhiều đối tượng phải biết chi tiết bên trong của nhau, mức **phụ thuộc lẫn nhau (coupling)** tăng lên. Khi một bên thay đổi, nhiều bên khác có thể phải sửa theo.

OOP tốt không có nghĩa là càng nhiều class càng tốt. Nếu tách một trách nhiệm thành nhiều lớp trung gian nhưng các lớp đó không tạo ra ranh giới hay trách nhiệm mới, chương trình chỉ trở nên khó đọc hơn.

### MỐI LIÊN HỆ — từ ranh giới đến đóng gói

Ngay khi ta nói “đối tượng này sở hữu trạng thái”, câu hỏi tiếp theo là:

> Ai được phép thay đổi trạng thái đó, và được thay đổi theo cách nào?

Đây chính là vấn đề mà **đóng gói (encapsulation)** giải quyết.

Một dấu hiệu đáng chú ý là:

```text
nếu bên gọi phải lấy rất nhiều trường ra ngoài để thực hiện một quy tắc
→ có thể quy tắc đó đang nằm sai ranh giới trách nhiệm
```

### THỰC HÀNH — ba câu hỏi về ranh giới

Với mỗi `class`, hãy thử trả lời:

1. trạng thái nào thực sự thuộc trách nhiệm của class này;
2. bên ngoài cần yêu cầu hành vi nào thay vì lấy dữ liệu thô nào;
3. nếu cách lưu dữ liệu bên trong thay đổi, có bao nhiêu đoạn mã bên ngoài phải sửa theo.

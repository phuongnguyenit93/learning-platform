`abstract` chỉ ngăn việc tạo đối tượng trực tiếp. Lớp trừu tượng vẫn dùng được làm kiểu tham chiếu:

```java
BasePayment payment = new CardPayment();
```

Giới hạn quan trọng hơn là Java chỉ cho một lớp `extends` **một lớp**. Vì vậy nếu một khả năng cần xuất hiện ở nhiều cây kế thừa không liên quan, ép tất cả vào cùng một lớp cha trừu tượng sẽ tạo ràng buộc không cần thiết.

Đó là lý do bước tiếp theo chuyển sang `interface`: **nếu ta chỉ cần một hợp đồng chung mà không muốn mọi cách triển khai phải thuộc cùng một cây kế thừa lớp thì sao?**

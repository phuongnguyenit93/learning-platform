Dùng `==`/`!=` để kiểm tra một tham chiếu có mang `null` hay không:

```java
boolean absent = user == null;
boolean present = user != null;
```

Gọi `user.equals(null)` là sai hướng vì nếu `user` chính là `null` thì chương trình đã truy cập qua tham chiếu `null` trước khi vào `equals`.

Sau khi học Luồng điều khiển, phép so sánh này thường được dùng làm điều kiện bảo vệ trước khi truy cập đối tượng. Khi cần so sánh bằng giữa các đối tượng có thể `null`, tiện ích như `Objects.equals(a, b)` có thể diễn đạt ý định rõ hơn, nhưng vẫn phải hiểu hợp đồng về khả năng nhận `null` của bài toán.

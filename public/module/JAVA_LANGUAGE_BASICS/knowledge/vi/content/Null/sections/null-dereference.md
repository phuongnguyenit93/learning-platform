Nếu mã cố dùng `null` như một đối tượng:

```java
name.length();
```

chương trình ném `NullPointerException` ở thời điểm chạy.

NPE thường không phải vấn đề “Java có null”, mà là ranh giới/hợp đồng không nói rõ giá trị có thể vắng mặt hay mã không kiểm tra bất biến cần thiết.

Nhiều thao tác có thể truy cập tham chiếu gián tiếp:

```java
user.getName();          // gọi phương thức instance
user.name;               // đọc trường instance
```

Khi tìm lỗi NPE, hãy hỏi **tham chiếu nào đang là `null` tại điểm truy cập**, thay vì chỉ thêm kiểm tra `null` ngẫu nhiên ở xa nguồn.

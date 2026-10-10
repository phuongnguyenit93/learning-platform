# Collection chuyên biệt cho enum — EnumSet và EnumMap

Khi miền khóa/phần tử đến từ một `enum`, tập giá trị hợp lệ đã được biết trước và có thứ tự khai báo cố định. `EnumSet` và `EnumMap` tận dụng đúng đặc điểm này để biểu diễn ý định rõ hơn so với collection tổng quát như `HashSet`/`HashMap`.

Ta dùng trạng thái đơn hàng làm ví dụ:

```java
enum OrderStatus {
    NEW,
    PAID,
    PACKING,
    SHIPPED,
    CANCELLED
}
```

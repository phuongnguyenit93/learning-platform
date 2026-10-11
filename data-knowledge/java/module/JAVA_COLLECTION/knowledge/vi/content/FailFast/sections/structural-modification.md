**Thay đổi cấu trúc (structural modification)** là thay đổi làm biến đổi cấu trúc mà iterator đang duyệt. Ý nghĩa chính xác phụ thuộc cách triển khai, nhưng với các collection phổ biến thường gồm thêm hoặc xóa phần tử/ánh xạ.

Ví dụ với `ArrayList`:

```java
List<String> users = new ArrayList<>(List.of("U01", "U02", "U03", "U04"));

users.add("U04");    // thay đổi cấu trúc: kích thước thay đổi
users.remove("U01"); // thay đổi cấu trúc: kích thước thay đổi
users.set(0, "U10"); // không phải thay đổi cấu trúc đối với ArrayList
```

Với `Map`, thêm/xóa một ánh xạ thường là thay đổi cấu trúc; thay giá trị của khóa đã tồn tại thường không thay cấu trúc tập khóa. Tuy nhiên mã nguồn ứng dụng không nên phụ thuộc vào trường nội bộ như `modCount` của một cách triển khai cụ thể. Quy ước của collection/iterator mới là ranh giới cần tin cậy.

Một ngoại lệ hữu ích cho cách hiểu đơn giản trên là `LinkedHashMap` ở chế độ thứ tự truy cập: một lần truy cập như `get` có thể làm entry đổi vị trí trong thứ tự duyệt, và việc sắp lại thứ tự đó có thể được xem là thay đổi cấu trúc đối với iterator fail-fast của nó. Vì vậy không nên rút gọn “thay đổi cấu trúc” thành “kích thước thay đổi”; cần đọc quy ước của collection cụ thể.

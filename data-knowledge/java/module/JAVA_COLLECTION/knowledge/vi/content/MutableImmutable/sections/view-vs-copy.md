Sự khác biệt nên được quyết định từ quyền sở hữu dữ liệu:

```java
List<Order> source = new ArrayList<>(List.of(
        new Order(1, 1, 20_000),
        new Order(2, 2, 10_000)
));

List<Order> readOnlyView = Collections.unmodifiableList(source);
List<Order> snapshot = List.copyOf(source);
List<Order> reverseView = source.reversed(); // Java 21: khung nhìn theo thứ tự ngược

source.add(new Order(3, 3, 15_000));

System.out.println(readOnlyView.size()); // 3
System.out.println(snapshot.size());     // 2
System.out.println(reverseView.getFirst().id()); // 3
```

Chọn **khung nhìn** khi muốn nhiều phía quan sát cùng một collection đang tồn tại và thay đổi của bên sở hữu phải xuất hiện ngay ở khung nhìn. Chọn **bản sao phòng vệ (defensive copy)** khi ranh giới API cần một bản chụp độc lập để bên gọi không bị ảnh hưởng bởi thay đổi cấu trúc sau đó của collection nguồn.

Cả khung nhìn lẫn bản sao đều không tự giải quyết an toàn luồng (thread-safety) hoặc tính bất biến sâu (deep immutability). Nếu collection được chia sẻ giữa nhiều luồng, cần thêm cơ chế đồng bộ hoặc collection hỗ trợ truy cập đồng thời phù hợp; phần đó thuộc module về xử lý đồng thời.

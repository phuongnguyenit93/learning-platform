Giới hạn cốt lõi của JDK Dynamic Proxy đến từ mô hình dựa trên interface:

- không có interface → JDK Proxy không thể cung cấp API của class cụ thể;
- chỉ các lời gọi instance đi qua proxy mới đi qua `InvocationHandler`;
- static method và constructor không phải lời gọi interface instance nên không bị JDK proxy chặn;
- gọi trực tiếp đối tượng đích bỏ qua proxy hoàn toàn;
- method/trạng thái private không nằm trong interface không tự nhiên trở thành điểm chặn lời gọi.
- sealed interface và hidden interface không hợp lệ làm proxy interface với `Proxy.newProxyInstance(...)` trên Java 21.

Một class cụ thể `final` vẫn có thể được **bọc** phía sau JDK proxy nếu đối tượng đó triển khai interface, vì JDK proxy không tạo subclass của class đích. `final` trở thành vấn đề khi dùng cơ chế **proxy dựa trên class** cần sinh subclass; lúc đó class final không thể được kế thừa và method final không thể được override/chặn theo cách proxy subclass hoạt động.

Spring AOP giúp ứng dụng làm việc ở mức trừu tượng cao hơn. Spring có thể dùng JDK Dynamic Proxy cho proxy dựa trên interface hoặc dùng proxy dựa trên class (CGLIB trong Spring) khi cần proxy class cụ thể/tùy cấu hình. Vì proxy dựa trên class dùng cơ chế tạo subclass, các class final, method final và method private không thể được override để áp dụng advice theo cơ chế đó.

Dynamic Proxy cũng không giải quyết mọi dạng chặn lời gọi. Chặn constructor, chặn static call, bytecode weaving hay hành vi self-invocation thuộc các cơ chế/thiết kế khác. Trong module Reflection, điều cần nắm là JDK Proxy cung cấp một **phần triển khai interface được tạo lúc chạy** với một handler chung cho lời gọi.

Dynamic Proxy là milestone tích hợp cuối trước phần tổng hợp. Đến đây người học đã thấy Reflection không chỉ là "gọi method bằng chuỗi" mà là một chuỗi từ siêu dữ liệu tới hành vi lúc chạy:

```text
Class<?> và siêu dữ liệu
→ các đối tượng mô tả Field / Method / Constructor
→ thao tác động
→ ranh giới truy cập
→ siêu dữ liệu chữ ký generic
→ chặn lời gọi interface bằng Dynamic Proxy
```

Chương cuối sẽ đặt toàn bộ chuỗi này vào mô hình quyết định: khi nào sự linh hoạt đó đáng để đổi lấy lỗi lúc chạy, liên kết ẩn, chi phí thực thi và chi phí bảo trì.

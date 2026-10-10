Truy cập phản chiếu sâu cho phép framework làm việc với constructor/field/method private khi ranh giới truy cập cho phép. Nhưng thành phần private vốn là chi tiết phần triển khai mà bên sở hữu được quyền thay đổi mà không cần giữ tương thích cho bên gọi bên ngoài.

Nếu mapper đọc `processedCount` bằng tên field hoặc framework gọi `internalStatus()`, mã đó đã tạo một hợp đồng ngầm:

```text
chi tiết triển khai của PaymentService
          ↓ tên/chữ ký private
bên sử dụng Reflection phụ thuộc vào nó
```

Đổi tên, tái cấu trúc package hoặc thay đổi tính đóng gói có thể làm bên sử dụng hỏng lúc chạy. JPMS còn khiến sự phụ thuộc này rõ hơn: package không `opens` thì truy cập phản chiếu sâu từ mô-đun khác có thể bị chặn hoàn toàn.

Khi thư viện/framework cần quyền truy cập qua Reflection bền vững, tốt hơn là thiết kế một điểm tích hợp rõ ràng: public interface, hợp đồng annotation, quy ước constructor/property được mô tả rõ, hoặc package `opens` có chủ đích. `setAccessible(true)` không nên trở thành cách mặc định để “sửa” một thiết kế API thiếu hợp đồng.

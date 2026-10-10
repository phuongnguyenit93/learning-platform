Phương thức `default` là phương thức của đối tượng có phần thân ngay trong interface:

```java
interface PaymentMethod {
    void pay(int amount);

    default String label() {
        return "payment";
    }
}
```

Lớp triển khai có thể kế thừa `label()` mà không cần tự viết ngay một phần thân khác.

Phương thức `default` vẫn là hành vi của đối tượng và có thể bị ghi đè (override). Khi nhiều phương thức `default` cạnh tranh, Java dùng các quy tắc giải quyết cụ thể thay vì tự chọn ngẫu nhiên.

### VÌ SAO

Nếu một interface công khai đã có nhiều lớp triển khai, thêm một phương thức abstract mới sẽ buộc các lớp đó phải bổ sung phần triển khai. Khi thật sự tồn tại một hành vi mặc định hợp lý, phương thức `default` có thể giúp mở rộng interface mà không buộc mọi lớp triển khai cũ phải sửa mã nguồn ngay lập tức.

`default` không có nghĩa interface trở thành abstract class: interface vẫn không có trường riêng cho từng đối tượng hay hàm khởi tạo riêng để giữ trạng thái.

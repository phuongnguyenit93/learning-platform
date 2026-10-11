### CƠ CHẾ — một đối tượng của class con gồm những gì?

Đối tượng của class con chứa phần trạng thái và hành vi được định nghĩa từ class cha, đồng thời có thể bổ sung phần riêng của class con.

```java
class PaymentMethod {
    String provider() { return "generic"; }
}

class CardPayment extends PaymentMethod {
    String cardNetwork() { return "VISA"; }
}
```

Một `CardPayment` có thể dùng `provider()` nếu phương thức đó có quyền truy cập phù hợp, đồng thời có thêm `cardNetwork()`.

Trường `private` của class cha vẫn tồn tại trong đối tượng, nhưng class con không truy cập trực tiếp nó bằng cú pháp truy cập thành viên thông thường.

### PHÂN BIỆT — nơi khai báo, việc được kế thừa và quyền truy cập là ba câu hỏi khác nhau

Ba câu hỏi sau khác nhau:

```text
Thành viên được khai báo ở đâu?
        ↓
Thành viên có được kế thừa vào kiểu con không?
        ↓
Mã hiện tại có quyền truy cập thành viên đó không?
```

Ví dụ, trạng thái `private` của class cha vẫn là một phần trạng thái của đối tượng `Child`, nhưng mã nguồn của `Child` không được truy cập trực tiếp trường đó. Ngược lại, một phương thức của cha có thể được kế thừa và dùng được nếu quy tắc truy cập cho phép.

Chi tiết đầy đủ của `private` / package-private / `protected` / `public` thuộc `class-object → Access Modifier`; chương này chỉ giữ mô hình tư duy cần cho kế thừa.

### RANH GIỚI VỚI CLASS-OBJECT — hàm khởi tạo không được kế thừa

Hàm khởi tạo **không được kế thừa**. Khi tạo đối tượng của class con, phần trạng thái do class cha sở hữu vẫn phải được khởi tạo thông qua chuỗi `this(...)` / `super(...)` phù hợp.

Một hàm khởi tạo của class con có thể ủy quyền cho hàm khởi tạo khác cùng class bằng `this(...)`; chuỗi đó cuối cùng phải dẫn tới hàm khởi tạo của class cha bằng `super(...)` tường minh hoặc `super()` được chèn ngầm khi hợp lệ. Việc khởi tạo phần class cha hoàn tất trước khi các bộ khởi tạo trường/khối khởi tạo của class con chạy, rồi mới tới thân hàm khởi tạo của class con.

Chi tiết đầy đủ về `this(...)`, `super(...)`, chuỗi hàm khởi tạo và thứ tự khởi tạo thuộc mô-đun `class-object → this, super và chuỗi khởi tạo`. OOP chỉ cần giữ hệ quả thiết kế: **class con có thể phụ thuộc vào cách class cha thiết lập và quản lý phần trạng thái của nó**.

### MỐI LIÊN HỆ — được kế thừa phương thức chưa phải là đa hình

Việc class con có sẵn phương thức từ class cha chưa phải điểm quan trọng nhất.

Điều thú vị xuất hiện khi class con **ghi đè (override)** một phương thức đối tượng và bên gọi giữ biến tham chiếu có kiểu cha. Khi đó Java phải quyết định phần triển khai nào sẽ chạy tại thời điểm thực thi.

Đó là cầu nối sang **đa hình (polymorphism)**.

### KHÁI NIỆM — điều kiện bất biến (invariant) là gì?

**Invariant** có thể hiểu là một **điều kiện luôn phải đúng để đối tượng được xem là hợp lệ**.

Ví dụ:

```text
Account.balance >= 0
Order.total >= 0
ShoppingCart không chứa sản phẩm có quantity <= 0
```

Constructor hoặc factory nên tạo ra đối tượng ở trạng thái hợp lệ. Sau đó, mọi phương thức công khai làm thay đổi trạng thái phải tiếp tục giữ các điều kiện đó đúng.

Có thể nhìn vòng đời invariant như một chuỗi liên tục:

```text
construction
→ đối tượng bắt đầu hợp lệ
→ mỗi thao tác công khai làm thay đổi trạng thái đều kiểm tra quy tắc cần thiết
→ đối tượng vẫn hợp lệ sau khi thay đổi
```

Nếu hàm khởi tạo tạo ra trạng thái sai, hoặc một phương thức công khai cho phép đi vòng qua quy tắc, đóng gói đã thất bại dù trường vẫn là `private`.

### CƠ CHẾ — thay đổi trạng thái thông qua hành vi có ý nghĩa

Thay vì cung cấp setter cho từng trường, hãy cung cấp phương thức biểu diễn đúng hành động cần thực hiện:

```java
account.withdraw(30);
```

Phương thức `withdraw` có đủ thông tin để kiểm tra:

- số tiền phải lớn hơn `0`;
- số tiền không được vượt quá số dư;
- sau khi rút, số dư vẫn hợp lệ.

Bên gọi không cần biết số dư đang được lưu như thế nào.

### MINH CHỨNG — `EncapsulationController#invariantProtection()`

Ví dụ thực thi của mô-đun tạo một `Account` có số dư ban đầu là `100`, rút `30`, sau đó thử rút thêm `100`.

Điều cần quan sát không chỉ là exception. Điểm quan trọng là:

```text
yêu cầu không hợp lệ bị từ chối
        +
trạng thái cuối vẫn hợp lệ
        =
điều kiện bất biến được bảo vệ
```

Đó là giá trị thực tế của đóng gói: đối tượng tự chịu trách nhiệm về các thay đổi trạng thái của chính nó.

### THỰC HÀNH — trước khi viết setter, hãy tìm điều kiện bất biến

Trước khi thêm một setter, hãy hỏi:

> Trường này có tham gia vào quy tắc nào cùng với các trường khác không?

Nếu có, một phương thức thể hiện đúng ý định thường an toàn hơn nhiều so với việc cho phép thay đổi từng trường độc lập.

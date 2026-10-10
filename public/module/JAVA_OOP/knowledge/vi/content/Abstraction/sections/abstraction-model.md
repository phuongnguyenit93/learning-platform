### KHÁI NIỆM — trừu tượng hóa là gì?

Abstraction là một mô hình hoặc hợp đồng chỉ công khai những khái niệm và hành vi mà bên sử dụng thực sự cần, đồng thời giấu những chi tiết không liên quan ở phía sau ranh giới.

Ví dụ với việc tính giá, `Checkout` có thể chỉ cần biết:

```java
interface Pricing {
    int price(int base);
}
```

`Checkout` không cần biết cách triển khai cụ thể tính giảm giá bằng:

- công thức;
- bảng quy tắc;
- database;
- dịch vụ bên ngoài.

Miễn là các chi tiết đó không thuộc hợp đồng `Pricing`, chúng không cần xuất hiện trong cách suy nghĩ của `Checkout`.

### MỐI LIÊN HỆ — trừu tượng hóa và đóng gói bổ sung nhau

Có thể phân biệt ngắn gọn như sau:

```text
Abstraction
→ bên sử dụng cần nhìn thấy điều gì?

Encapsulation
→ bên sử dụng không được tùy ý truy cập hoặc thay đổi điều gì?
```

Một API có thể dùng `private` rất nhiều nhưng trừu tượng hóa vẫn tệ nếu nó bắt bên ngoài phải biết quá nhiều thao tác chi tiết.

Ngược lại, một `interface` rất nhỏ cũng chưa chắc là trừu tượng hóa tốt nếu những chi tiết quan trọng như lỗi, vòng đời hay thứ tự vẫn bị rò rỉ một cách khó hiểu.

### CƠ CHẾ — trừu tượng hóa không đồng nghĩa với từ khóa `abstract`

`interface` và `abstract class` là những cơ chế phổ biến để biểu diễn trừu tượng hóa trong Java.

Nhưng trừu tượng hóa không đồng nghĩa với từ khóa `abstract`.

Một class cụ thể hoặc thậm chí một hàm cũng có thể tạo ra trừu tượng hóa tốt nếu hợp đồng của nó rõ ràng và bên sử dụng không cần biết chi tiết triển khai.

### HỢP ĐỒNG — trừu tượng hóa không chỉ là danh sách phương thức

Một trừu tượng hữu ích thường cần làm rõ nhiều hơn tên phương thức. Tùy miền bài toán, hợp đồng có thể bao gồm:

```text
hành vi được cung cấp
+
input hợp lệ / precondition
+
kết quả hoặc postcondition
+
ngữ nghĩa khi thất bại
+
side effects
+
ràng buộc vòng đời / thứ tự khi chúng ảnh hưởng tới tính đúng đắn
```

Ví dụ:

```java
interface Storage {
    void save(Data data);
}
```

chưa tự nói cho bên gọi biết `save` có thể thất bại thế nào, có tính lũy đẳng (idempotent) hay không, có yêu cầu transaction/vòng đời nào không. Những chi tiết ảnh hưởng cách dùng đúng **là một phần của hợp đồng**, không nên bị giấu chỉ vì cách triển khai nằm phía sau `interface`.

Mô-đun `abstract-interface` sẽ đi sâu hơn vào việc chọn `interface` hay `abstract class`. Ở mô-đun này, trọng tâm là **vai trò thiết kế của trừu tượng hóa**.

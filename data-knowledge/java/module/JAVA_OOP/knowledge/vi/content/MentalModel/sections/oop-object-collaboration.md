### KHÁI NIỆM — OOP là gì?

Trong OOP, chương trình được tổ chức xoay quanh các **đối tượng (object)**. Mỗi đối tượng thường có:

- một phần **trạng thái (state)** mà nó sở hữu;
- một **trách nhiệm (responsibility)** rõ ràng;
- các **hành vi (behavior)** mà bên ngoài có thể yêu cầu nó thực hiện.

Một đối tượng vì vậy không chỉ là “một nơi chứa các trường (`field`)”. Khi thiết kế một đối tượng, ta nên trả lời được ba câu hỏi:

1. đối tượng này sở hữu trạng thái nào;
2. nó chịu trách nhiệm về điều gì;
3. đoạn mã bên ngoài được phép yêu cầu nó thực hiện những hành vi nào.

Ví dụ trong một luồng thanh toán:

```text
ShoppingCart
→ sở hữu danh sách sản phẩm và các quy tắc thay đổi giỏ hàng

PricingPolicy
→ chịu trách nhiệm tính giá theo một chính sách cụ thể

PaymentMethod
→ chịu trách nhiệm thực hiện thanh toán

CheckoutService
→ phối hợp các đối tượng trên để hoàn thành quá trình thanh toán
```

### VÍ DỤ XUYÊN SUỐT — mô hình nào sẽ được dùng xuyên mô-đun?

Phần lớn mô-đun sẽ quay lại cùng một nhóm vai trò để người học nhìn thấy **một thiết kế tiến hóa qua từng khái niệm**, thay vì mỗi chương bắt đầu từ một miền bài toán hoàn toàn mới:

```text
Checkout / CheckoutService
→ thành phần điều phối luồng checkout

PaymentMethod
→ hợp đồng/hành vi thanh toán có nhiều cách triển khai

CardPayment / WalletPayment
→ các cách triển khai cụ thể để quan sát quan hệ kiểu con, đa hình và phân phối lời gọi

Pricing
→ đối tượng cộng tác có thể được thay thế để quan sát kết hợp đối tượng, ủy quyền và trừu tượng hóa
```

Một vài ví dụ phụ như `Account`, `Team/Player` hoặc `Order/OrderLine` vẫn xuất hiện khi chúng minh họa tốt hơn một cạm bẫy chuyên biệt như điều kiện bất biến hoặc quyền sở hữu/vòng đời. Chúng là ví dụ hỗ trợ, không phải một lộ trình kiến thức riêng tách khỏi luồng checkout chính.

Điểm quan trọng không nằm ở việc ta đã tạo bao nhiêu `class`. Điểm quan trọng là **quy tắc được đặt ở đúng nơi chịu trách nhiệm**. Đoạn mã bên ngoài gửi yêu cầu thông qua phương thức (`method`), còn đối tượng tự bảo vệ trạng thái và thực hiện các quy tắc thuộc về nó.

### VÌ SAO — tại sao không dồn tất cả vào một hàm?

Với chương trình nhỏ, mã lệnh viết theo phong cách thủ tục thường rất dễ đọc. Vấn đề xuất hiện khi nhiều thao tác cùng đọc hoặc thay đổi một trạng thái và nhiều nơi cùng phải biết những quy tắc giống nhau.

Ví dụ, nếu quy tắc giảm giá được viết ở ba nơi khác nhau thì khi chính sách giảm giá thay đổi, cả ba nơi đều phải được sửa. Nếu một nơi bị quên, hành vi của hệ thống sẽ không còn nhất quán.

OOP cố gắng **khoanh vùng ảnh hưởng của thay đổi**:

```text
quy tắc về giá
→ đặt gần thành phần chịu trách nhiệm tính giá

quy tắc đảm bảo trạng thái hợp lệ
→ đặt gần đối tượng sở hữu trạng thái đó

quy tắc thanh toán
→ đặt gần thành phần chịu trách nhiệm thanh toán
```

Vì vậy, giá trị của OOP không nằm ở việc “chia chương trình thành thật nhiều class”, mà nằm ở việc **đặt đúng dữ liệu và hành vi vào đúng nơi chịu trách nhiệm**.

### MỐI LIÊN HỆ — các chặng trong mô-đun nối với nhau thế nào?

Các chương tiếp theo không phải những định nghĩa rời rạc. Chúng hình thành một chuỗi câu hỏi:

```text
Lập trình hướng đối tượng (OOP) là gì và vì sao cần?
        ↓
Một đối tượng sở hữu trạng thái
        ↓
Làm sao ngăn bên ngoài phá trạng thái đó?
Đóng gói và bảo vệ trạng thái hợp lệ
        ↓
Làm sao một kiểu có thể được dùng như một kiểu tổng quát hơn?
Kế thừa và quan hệ kiểu con
        ↓
Làm sao cùng một hợp đồng nhưng mỗi kiểu có hành vi khác nhau?
Đa hình và phân phối động
        ↓
Java chọn phương thức ở lúc biên dịch và lúc chạy như thế nào?
Cách Java chọn phương thức
        ↓
Nếu kế thừa làm các lớp phụ thuộc nhau quá chặt thì sao?
Cộng tác giữa các đối tượng bằng kết hợp và ủy quyền
        ↓
Bên sử dụng thực sự cần biết điều gì?
Trừu tượng hóa và hợp đồng hành vi
        ↓
Kết nối các quyết định trên thành một mô hình thống nhất
Tổng hợp tư duy thiết kế hướng đối tượng
```

Đóng gói, kế thừa, đa hình và trừu tượng hóa thường được gọi là “bốn trụ cột của OOP”. Cách gọi này hữu ích để ghi nhớ, nhưng không nên hiểu chúng là bốn phần độc lập. Chúng liên hệ chặt chẽ và thường được sử dụng cùng với kết hợp đối tượng, ủy quyền và cách chia trách nhiệm rõ ràng.

### CƠ CHẾ — Java hỗ trợ OOP bằng những gì?

Java cung cấp nhiều cơ chế như:

- `class` và đối tượng;
- từ khóa kiểm soát truy cập như `private`, `protected`, `public`;
- `extends` và `implements`;
- overriding;
- overloading;
- cơ chế chọn phương thức khi chạy (**phân phối động - dynamic dispatch**);
- giữ tham chiếu tới đối tượng khác để tạo **kết hợp đối tượng (composition)**.

Nhưng cần phân biệt rõ:

```text
Khái niệm thiết kế
→ đóng gói, trách nhiệm, đa hình, khả năng thay thế, trừu tượng hóa...

Cơ chế của Java
→ `private`, `extends`, `implements`, ghi đè, nạp chồng, phân phối động...
```

Một chương trình dùng đầy đủ từ khóa và cơ chế thường gắn với OOP vẫn có thể thiết kế kém. Ngược lại, thiết kế tốt bắt đầu từ việc hiểu trách nhiệm và mối quan hệ giữa các đối tượng, sau đó mới chọn cơ chế Java phù hợp.

### THỰC HÀNH — câu hỏi tự kiểm tra

Khi nhìn vào một `class`, đừng chỉ hỏi “class này có những trường và phương thức nào?”. Hãy thử hỏi:

1. trạng thái nào thực sự thuộc về nó;
2. quy tắc nào nó phải tự bảo vệ;
3. đoạn mã nào bên ngoài đang biết quá nhiều chi tiết nội bộ của nó.

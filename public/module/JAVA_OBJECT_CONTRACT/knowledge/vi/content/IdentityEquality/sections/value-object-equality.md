**Đối tượng giá trị (value object)** thường được nhận diện bởi **giá trị có ý nghĩa**, không phải bởi định danh của đối tượng.

Ví dụ hai đối tượng `Money(100, "USD")` có thể được xem là bằng nhau nếu số tiền và đơn vị tiền tệ giống nhau, dù chúng được tạo ở hai thời điểm khác nhau.

### ĐỐI TƯỢNG GIÁ TRỊ KHÁC THỰC THỂ Ở ĐÂU?

Một mô hình tư duy hữu ích:

```text
Đối tượng giá trị
→ "nó mang giá trị gì?"

Thực thể
→ "nó là thực thể nào?"
```

Ví dụ `Money(100, "USD")` thường so sánh bằng nhau theo giá trị. Một `User` có thể so sánh bằng nhau theo mã định danh ổn định như `userId`, chứ không nhất thiết theo toàn bộ trạng thái có thể thay đổi như tên hiển thị hoặc địa chỉ.

Điều quan trọng là **chọn quy tắc bằng nhau theo ý nghĩa nghiệp vụ**, không phải máy móc đưa mọi trường dữ liệu vào công cụ sinh mã của IDE.

### TRẠNG THÁI DÙNG ĐỂ XÁC ĐỊNH BẰNG NHAU NÊN ỔN ĐỊNH

Một thiết kế phép bằng nhau tốt thường cần:

- dựa trên các thành phần thực sự định nghĩa giá trị hoặc định danh nghiệp vụ;
- giữ các tính chất phản xạ, đối xứng, bắc cầu và nhất quán;
- giữ hành vi của `hashCode` nhất quán với phép bằng nhau, để các đối tượng được xem là bằng nhau luôn tạo cùng mã băm;
- tránh thay đổi trạng thái đó khi đối tượng đang làm khóa hoặc phần tử của cấu trúc dữ liệu băm/có thứ tự.

Ví dụ nếu `UserId` được định nghĩa chỉ bởi `value`, `equals` và `hashCode` cũng nên dựa trên đúng `value` đó.

### CHUYỂN TIẾP

Ta đã biết **phép bằng nhau về mặt logic là quyết định của lớp và nghiệp vụ**, không phải của định danh tham chiếu. Chương tiếp theo đi vào chính xác `equals` phải giữ những quy tắc nào để thư viện Java có thể tin quyết định đó.

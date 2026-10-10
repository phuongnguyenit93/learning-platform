### KHÁI NIỆM — “is-a” nên được hiểu như thế nào?

Trong Java, khi một class dùng `extends`, nó tạo ra quan hệ **kiểu con (subtype)** với class cha.

```java
PaymentMethod payment = new CardPayment();
```

Ở đây `CardPayment` có thể được gán cho một biến có kiểu `PaymentMethod`.

Tuy nhiên, “is-a” không nên chỉ được hiểu là “hai class có vài trường giống nhau”. Ý nghĩa quan trọng hơn là:

> Một đối tượng của kiểu con có thể được dùng ở nơi kiểu cha được yêu cầu mà vẫn giữ được hành vi hợp lý theo hợp đồng của kiểu cha.

Nếu `CardPayment` chỉ kế thừa để dùng lại vài dòng mã nhưng lại phá những kỳ vọng quan trọng của `PaymentMethod`, chương trình có thể vẫn biên dịch nhưng thiết kế đã có vấn đề.

### MỐI LIÊN HỆ — kế thừa và subtyping không hoàn toàn cùng mục tiêu

Kế thừa class trong Java có thể mang hai mục đích khác nhau:

```text
Dùng lại phần triển khai
→ nhận lại một phần trạng thái hoặc phương thức từ class cha

Tạo quan hệ kiểu con
→ đối tượng của class con dùng được ở nơi class cha được yêu cầu
```

Hai mục đích này thường bị trộn lẫn.

Nếu mục tiêu duy nhất là dùng lại vài phương thức, kết hợp đối tượng (`composition`) có thể tạo ít phụ thuộc hơn. Nếu bên sử dụng thực sự cần thay thế nhiều cách triển khai thông qua một kiểu chung, quan hệ kiểu con mới có ý nghĩa rõ ràng hơn.

`interface` cũng tạo được quan hệ kiểu con mà không cần kế thừa phần triển khai từ class cha. Mô-đun `abstract-interface` sẽ đi sâu hơn vào phần này.

### GIỚI HẠN — Java chỉ cho một class cha trực tiếp

Một class Java chỉ có thể `extends` **một class trực tiếp**. Điều này giúp tránh một số xung đột trạng thái/cách triển khai của đa kế thừa class, nhưng đồng thời làm cho việc chọn class cha trở thành một quyết định tạo phụ thuộc khá mạnh.

`final class` chặn việc tạo class con; `final` vì vậy không chỉ là cú pháp, mà còn có thể biểu đạt rằng kiểu đó không mở rộng hợp đồng bằng kế thừa class.

### THỰC HÀNH — kiểm tra “is-a” bằng hành vi

Đừng chỉ hỏi:

> `CardPayment` có nghe giống một loại payment không?

Hãy hỏi mạnh hơn:

> Mọi đoạn mã chỉ biết `PaymentMethod` có thể dùng `CardPayment` mà không cần trường hợp xử lý riêng hay không?

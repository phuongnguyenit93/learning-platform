# Siêu dữ liệu Generics còn lại sau xóa kiểu

Sau khi Reflection đã lấy được siêu dữ liệu của class/thành phần, một vấn đề khác xuất hiện: generic trong Java bị **xóa kiểu (type erasure)**, vậy lúc chạy còn biết gì về `List<String>`, `T extends Number` hay `? super Integer`?

Câu trả lời cần tách làm hai phần. JVM thường không mang đối số kiểu của từng đối tượng để thực thi như một kiểu generic riêng ở lúc chạy, nhưng trình biên dịch có thể ghi **siêu dữ liệu chữ ký generic** vào class file. Reflection đọc siêu dữ liệu của khai báo đó qua `Type` và các subtype của nó.

Chương này giả định người học đã đi qua mô-đun Generics. Chỉ cần nhớ bốn ý để nối sang Reflection: **xóa kiểu (erasure)** loại bỏ phần lớn đối số kiểu khỏi kiểu dùng để thực thi; **biến kiểu (type variable)** là biến như `T`; **giới hạn kiểu (bound)** quy định `T` được phép đại diện cho gì; **wildcard** như `? extends X` / `? super X` mô tả quan hệ kiểu trong khai báo. Ở đây ta không học lại Generics — ta học **Reflection biểu diễn những khai báo đó như thế nào bằng siêu dữ liệu lúc chạy**.

Mô hình ví dụ xuyên suốt vẫn là miền thanh toán. Ví dụ một field generic tự nhiên có thể là:

```java
class PaymentService {
    private List<PaymentRequest> recentRequests;
}
```

Reflection có thể thấy kiểu thô là `List.class` nhưng khai báo generic vẫn mô tả `List<PaymentRequest>` nếu siêu dữ liệu chữ ký được giữ lại.

`PaymentService` không tự nhiên chứa đủ mọi dạng kiểu generic. Vì vậy từ đây chương dùng thêm `Repository<T ...>` **chỉ như ví dụ phụ** để quan sát `TypeVariable`, wildcard và mảng generic mà không làm méo mô hình thanh toán chính:

```java
class Repository<T extends Number & Comparable<T>> {
    List<? extends T> values;
    List<? super Integer> sinks;
    T[] buffer;
}
```

Mô hình này vẫn thuộc cùng cách hiểu về Reflection: khai báo trong mã nguồn được trình biên dịch biến thành siêu dữ liệu class, rồi Reflection dựng lại một mô hình để công cụ/framework đọc lúc chạy.

# Generics là gì và vì sao cần?

Module này đứng **trước Collection**, nên chưa cần biết `List`, `Set` hay `Map` hoạt động thế nào. Trước hết chỉ cần giữ một câu hỏi:

```text
Nếu cùng một cách xử lý phải làm việc với nhiều kiểu dữ liệu khác nhau,
làm sao viết cách xử lý đó một lần mà compiler vẫn kiểm tra đúng kiểu?
```

Đó chính là bài toán của **Generics**.

> **Generics là cơ chế của Java cho phép lớp (`class`), giao diện (`interface`), hàm tạo (`constructor`) hoặc phương thức (`method`) khai báo kiểu dữ liệu như một tham số.**
>
> Nhờ vậy ta có thể tái sử dụng cùng một cấu trúc/thuật toán cho nhiều kiểu dữ liệu mà vẫn giữ kiểm tra kiểu ngay khi biên dịch.

`<T>`, wildcard, PECS hay type erasure chỉ là các cơ chế và quy tắc phát triển từ ý tưởng cốt lõi này.

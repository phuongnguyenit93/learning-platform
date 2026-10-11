# Định nghĩa Annotation tùy chỉnh

Annotation tùy chỉnh cho phép ứng dụng hoặc framework định nghĩa **cấu trúc siêu dữ liệu của riêng mình**. Nhưng việc tạo một Annotation mới không nên bắt đầu từ câu hỏi “cú pháp `@interface` viết thế nào?”, mà từ câu hỏi:

> Thành phần nào sẽ đọc siêu dữ liệu này, và nó cần biết điều gì?

Ví dụ xuyên suốt của module:

```java
@Audit(action = "TRANSFER", level = 2)
void transfer() {
}
```

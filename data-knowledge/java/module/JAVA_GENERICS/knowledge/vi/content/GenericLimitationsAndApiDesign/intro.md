# Giới hạn của Generics và thiết kế API

Chương này thuộc **lượt học sâu** nhiều hơn là cú pháp cần dùng mỗi ngày. Người mới nên biết các giới hạn tồn tại và hiểu nguyên nhân chính; không cần học thuộc từng trường hợp biên trước khi bắt đầu sử dụng Generics.

Sau khi hiểu `T`, wildcard và erasure, một loạt câu hỏi thường xuất hiện:

```java
// List<int> numbers;             // tại sao không được?
// T value = new T();             // tại sao không được?
// T[] values = new T[10];        // tại sao không được?
// Object value; value instanceof List<String> // tại sao không được?
```

Nếu chỉ học từng dòng như một “luật cấm”, Generics rất dễ biến thành một đống quy tắc phải học thuộc.

Chương này gom chúng lại theo **nguyên nhân**.

Nhiều giới hạn có thể hiểu từ sự kết hợp của các yếu tố sau, nhưng không phải mọi quy tắc đều có đúng một nguyên nhân duy nhất:

```text
Generics chủ yếu được kiểm tra khi biên dịch
        +
type erasure làm mất một phần danh tính kiểu generic ở runtime
        +
một số cơ chế của JVM cần biết kiểu thật ở runtime
```

Khi các ý này đã rõ, nhiều giới hạn như dùng kiểu nguyên thủy làm type argument, `new T()`, mảng generic hay một số giới hạn runtime sẽ bớt “vô lý”. Những quy tắc khác, như phạm vi của type parameter trong ngữ cảnh `static` hoặc giới hạn với `Throwable`, còn phụ thuộc vào chính mô hình kiểu và quy tắc ngôn ngữ Java.

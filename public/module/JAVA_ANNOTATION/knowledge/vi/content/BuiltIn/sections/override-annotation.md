Trong trường hợp phổ biến nhất, `@Override` nói với trình biên dịch:

> “Method này được viết với ý định override hoặc implement một method từ supertype; hãy báo lỗi nếu điều đó không đúng.”

Ví dụ:

```java
class Parent {
    void process() {
    }
}

class Child extends Parent {
    @Override
    void process() {
    }
}
```

Giá trị lớn nhất của `@Override` xuất hiện khi mã nguồn thay đổi hoặc có lỗi gõ tên:

```java
class Child extends Parent {
    @Override
    void proccess() { // lỗi khi biên dịch
    }
}
```

Không có `@Override`, method bị viết sai tên vẫn có thể trở thành một method mới hoàn toàn hợp lệ. Với Annotation, ý định trở thành một **quy tắc được trình biên dịch kiểm tra**.

### Điều `@Override` không làm

Nó không tạo ra polymorphism và không biến một method thành virtual. Ngữ nghĩa ghi đè của Java tồn tại độc lập; Annotation chỉ yêu cầu trình biên dịch xác nhận phần khai báo đáp ứng một trường hợp mà `@Override` được Java cho phép. Ngoài override/implement method của supertype, Java 21 còn cho phép `@Override` trên accessor method được khai báo tường minh cho một record component.

Vì vậy nên dùng `@Override` cho method override/implement bất cứ khi nào phù hợp. Nó vừa là tài liệu vừa là cơ chế bảo vệ chống sai sót.

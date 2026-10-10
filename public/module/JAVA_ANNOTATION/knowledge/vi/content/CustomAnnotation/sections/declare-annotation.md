Custom annotation được khai báo bằng `@interface`:

```java
public @interface Audit {
    String action();
    int level() default 1;
}
```

Mỗi khai báo có dạng giống method bên trong định nghĩa một **phần tử Annotation (annotation element)**.

Annotation interface có ngữ nghĩa riêng, không phải một interface thường chỉ vì cú pháp có chữ `interface`. Nó có superinterface trực tiếp là `java.lang.annotation.Annotation`; lập trình viên không tự viết `extends Annotation` để biến một interface thường thành kiểu Annotation.

Các phần tử cũng có giới hạn riêng:

- không có parameter;
- không có type parameter;
- không có `throws`;
- return type phải thuộc nhóm type hợp lệ dành cho phần tử Annotation.

Annotation interface bản thân cũng không generic và không khai báo một `extends` clause tùy ý. Các method đại diện cho phần tử Annotation có quy tắc chuyên biệt tương đương accessor của siêu dữ liệu, không phải nơi định nghĩa hành vi `static`/`default`/`private` như interface thường.

Ví dụ sử dụng:

```java
@Audit(action = "TRANSFER", level = 2)
public void transfer() {
}
```

Trình biên dịch kiểm tra tên phần tử, type của giá trị và việc đã cung cấp các phần tử bắt buộc hay chưa.

### Kiểu Annotation chỉ định nghĩa cấu trúc siêu dữ liệu

Khai báo `@Audit` không tự ghi log:

```text
khai báo @Audit
→ định nghĩa cấu trúc siêu dữ liệu

vị trí sử dụng @Audit
→ gắn siêu dữ liệu cụ thể vào mã nguồn

thành phần đọc
→ đọc siêu dữ liệu và quyết định làm gì
```

Thành phần đọc tại thời gian chạy có thể là framework/Reflection. Thành phần đọc tại thời điểm biên dịch có thể là annotation processor. Nếu không có thành phần đọc, siêu dữ liệu vẫn chỉ là siêu dữ liệu.

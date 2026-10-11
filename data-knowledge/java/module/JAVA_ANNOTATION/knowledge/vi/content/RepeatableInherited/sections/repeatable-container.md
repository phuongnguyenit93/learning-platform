Nếu `@Audit` không có `@Repeatable`, việc viết cùng một kiểu Annotation hai lần tại cùng ngữ cảnh là lỗi khi biên dịch. Vì vậy khả năng lặp lại là **một phần được khai báo tường minh trong quy tắc của Annotation**, không phải chỉ là cách viết đẹp hơn.

Khai báo Annotation lặp lại:

```java
@Repeatable(Audits.class)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Audit {
    String action();
    int level() default 1;
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Audits {
    Audit[] value();
}
```

Cách sử dụng:

```java
@Audit(action = "SECURITY")
@Audit(action = "COMPLIANCE")
void transfer() {
}
```

Khi cùng một Annotation lặp lại xuất hiện nhiều lần, Java sử dụng **Annotation chứa** (`Audits`) để biểu diễn tập giá trị theo quy tắc của `@Repeatable`.

Java kiểm tra sự tương thích giữa Annotation lặp lại và Annotation chứa. Các ràng buộc quan trọng gồm:

- Annotation chứa phải có `value()` trả về `Audit[]`;
- các phần tử khác của Annotation chứa phải có giá trị mặc định;
- chính sách lưu giữ của Annotation chứa không được ngắn hơn Annotation lặp lại;
- Annotation lặp lại phải áp dụng được ít nhất trên các loại khai báo/vị trí sử dụng type mà Annotation chứa hỗ trợ; Annotation chứa có thể hẹp hơn và khi đó nơi được phép lặp cũng hẹp theo;
- nếu Annotation lặp lại có `@Documented` hoặc `@Inherited` thì Annotation chứa cũng phải đáp ứng quy tắc tương ứng.

Mô hình tư duy:

```text
mã nguồn
@Audit(action = "SECURITY")
@Audit(action = "COMPLIANCE")

biểu diễn logic qua Annotation chứa
@Audits({
    @Audit(action = "SECURITY"),
    @Audit(action = "COMPLIANCE")
})
```

Annotation chứa không phải chi tiết có thể bỏ qua hoàn toàn, vì API Reflection mức thấp và API tra cứu “theo type” có ngữ nghĩa khác nhau.

Các giá trị lặp giữ thứ tự trong mã nguồn theo quy tắc biểu diễn của Annotation chứa. Không nên trộn tùy tiện Annotation chứa viết tường minh với các Annotation lặp ở cùng ngữ cảnh; ngoài việc khó đọc, một số tổ hợp còn tạo lỗi trùng Annotation chứa khi biên dịch.

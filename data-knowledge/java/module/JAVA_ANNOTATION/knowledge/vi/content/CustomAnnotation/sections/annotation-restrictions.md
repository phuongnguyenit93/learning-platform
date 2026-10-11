Annotation không cho phép phần tử mang bất kỳ đối tượng tùy ý nào. Java giới hạn type của phần tử để siêu dữ liệu có thể được biểu diễn ổn định trong class file và mô hình mã nguồn.

Các nhóm type hợp lệ là:

- primitive type như `int`, `boolean`, `double`;
- `String`;
- `Class` hoặc dạng parameterized của `Class`, ví dụ `Class<? extends Handler>`;
- enum type;
- annotation type khác;
- mảng một chiều của một trong các type hợp lệ trên.

Không chỉ return type bị giới hạn; **giá trị được ghi khi sử dụng Annotation cũng phải là dạng Java có thể biểu diễn như giá trị Annotation tại thời điểm biên dịch**: constant expression phù hợp, class literal, enum constant, Annotation lồng nhau hoặc mảng các giá trị hợp lệ. Không thể dùng `new SomeObject()` hay gọi một method tùy ý để tính giá trị Annotation.

Ví dụ:

```java
public @interface EndpointPolicy {
    String name();
    int timeoutSeconds() default 30;
    Class<? extends Runnable> handler();
    Mode mode() default Mode.SYNC;
    Tag tag() default @Tag("default");
    String[] roles() default {};
}
```

Các dạng sau không hợp lệ:

```java
public @interface Invalid {
    // Object value();          // không hợp lệ
    // List<String> names();   // không hợp lệ
    // String[][] matrix();    // mảng lồng nhau không hợp lệ
}
```

Phần tử Annotation cũng không dùng `null` làm giá trị. Nếu miền nghiệp vụ cần biểu diễn “không có giá trị”, quy tắc Annotation phải thiết kế một giá trị mặc định/giá trị đặc biệt rõ ràng hoặc tách siêu dữ liệu thành cấu trúc khác.

### Phần tử Annotation không được tạo vòng phụ thuộc

Mặc dù kiểu Annotation khác là một type hợp lệ cho phần tử, annotation interface không được tự tham chiếu qua phần tử theo kiểu trực tiếp hoặc gián tiếp:

```java
// Không hợp lệ: tự tham chiếu trực tiếp
@interface A {
    A value();
}

// Không hợp lệ: vòng A -> B -> A
@interface B {
    C value();
}

@interface C {
    B value();
}
```

Lý do là cấu trúc Annotation phải hữu hạn để trình biên dịch/class file có thể biểu diễn; khai báo phần tử Annotation tạo vòng phụ thuộc là lỗi tại thời điểm biên dịch.

### Phần tử không được xung đột với quy tắc của `Object` / `Annotation`

Phần tử Annotation nhìn giống method không tham số, nhưng không được có signature tương đương về ghi đè với method `public` hoặc `protected` của `Object` hay `java.lang.annotation.Annotation`.

Ví dụ:

```java
public @interface InvalidMetadata {
    // int hashCode();          // không hợp lệ
    // String toString();       // không hợp lệ
    // Class annotationType();  // không hợp lệ
}
```

Các method như `equals(...)`, `hashCode()`, `toString()` và `annotationType()` đã thuộc quy tắc chung của một Annotation instance; chúng không phải phần tử siêu dữ liệu mà người định nghĩa Annotation được phép định nghĩa lại.

### Vì sao các giới hạn này quan trọng?

Siêu dữ liệu Annotation không phải một đồ thị đối tượng tùy ý ở thời gian chạy. Nó phải có thể được trình biên dịch ghi, công cụ đọc và class loader/JVM biểu diễn theo định dạng đã xác định. Vì vậy Annotation phù hợp với **siêu dữ liệu khai báo nhỏ, ổn định**, không phù hợp để chứa đối tượng nghiệp vụ phức tạp.

> **Ranh giới cho người mới:** ở module Annotation, mục tiêu là hiểu `@FunctionalInterface` biến ý định thiết kế thành điều trình biên dịch kiểm tra. Lambda, method reference và function type sẽ được đào sâu ở module Functional Programming.

Functional interface là interface có đúng một **abstract method** theo định nghĩa của Java, nên có thể là target type của lambda/method reference.

```java
@FunctionalInterface
interface PriceRule {
    long apply(long amount);
}
```

Annotation yêu cầu trình biên dịch xác nhận interface vẫn đáp ứng quy tắc của functional interface:

```java
@FunctionalInterface
interface BrokenRule {
    long apply(long amount);
    boolean enabled(); // lỗi khi biên dịch
}
```

`default` và `static` methods không tự làm mất tính functional:

```java
@FunctionalInterface
interface PriceRule {
    long apply(long amount);

    default boolean enabled() {
        return true;
    }
}
```

Các `private` interface methods cũng không trở thành function descriptor. Ngoài ra, abstract methods tương ứng với public methods của `Object` không được tính như một SAM độc lập; những abstract declarations tương đương về ghi đè có thể cùng biểu diễn một function descriptor theo quy tắc của Java.

### Annotation không bắt buộc để dùng lambda

Một interface thỏa quy tắc functional interface vẫn có thể dùng với lambda dù không có `@FunctionalInterface`. Annotation hữu ích vì nó biến **ý định thiết kế API** thành quy tắc mà trình biên dịch kiểm tra được khi interface tiến hóa.

### Chuyển sang Annotation tùy chỉnh

Các Annotation có sẵn cho thấy một mô hình quan trọng:

```text
quy tắc siêu dữ liệu
+ thành phần đọc hiểu quy tắc
= giá trị thực tế
```

Tiếp theo ta sẽ tự định nghĩa một cấu trúc siêu dữ liệu bằng Annotation tùy chỉnh thay vì chỉ sử dụng các quy tắc Java cung cấp sẵn.

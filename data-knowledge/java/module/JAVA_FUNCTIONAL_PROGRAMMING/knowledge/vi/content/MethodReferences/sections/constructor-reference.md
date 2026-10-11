Tham chiếu hàm tạo có dạng `TypeName::new`. Nó cho phép một giao diện hàm mô tả việc tạo đối tượng mà không cần viết lambda chỉ để gọi `new`.

```java
Supplier<List<String>> listFactory = ArrayList::new;
Function<String, StringBuilder> builderFactory = StringBuilder::new;

List<String> names = listFactory.get();
StringBuilder builder = builderFactory.apply("Java");
```

Kiểu đích quyết định dạng hàm tạo cần tìm. `Supplier` không có tham số cần một hàm tạo tương thích không tham số, còn `Function` một tham số cần một hàm tạo tương thích với một đối số.

Cơ chế suy luận kiểu tổng quát (generic) vẫn áp dụng bình thường. Tham chiếu hàm tạo không bỏ qua các quy tắc về quyền truy cập hoặc chọn phiên bản nạp chồng của Java.

Mảng cũng hỗ trợ tham chiếu hàm tạo. Trong trường hợp này, giao diện hàm đích cung cấp độ dài mảng cần tạo:

```java
IntFunction<String[]> stringArray = String[]::new;
String[] values = stringArray.apply(3);
```

Với tham chiếu đã gắn với một đối tượng như `receiver::method`, biểu thức `receiver` được đánh giá ngay khi biểu thức tham chiếu phương thức được đánh giá. Nếu kết quả là `null`, việc tạo tham chiếu đó ném `NullPointerException`; kiểm tra `null` không bị trì hoãn tới lúc gọi phương thức hàm.

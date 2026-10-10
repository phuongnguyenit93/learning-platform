`Consumer<T>` nhận một giá trị và không trả kết quả. Phương thức hàm có dạng:

```java
void accept(T value);
```

Ví dụ:

```java
Consumer<String> printer = text -> System.out.println(text);
printer.accept("hello");
```

Consumer thường đại diện cho một hành động có tác động quan sát được như ghi nhật ký, gửi dữ liệu, cập nhật đối tượng hoặc gọi dịch vụ khác.

Vì `Consumer` trả `void`, nó không phù hợp khi bên gọi cần nhận lại một giá trị đã biến đổi. Trường hợp đó thường nên dùng `Function` hoặc một hợp đồng có đầu ra rõ ràng hơn.

Tác dụng phụ là hợp lệ trong mã theo phong cách hàm của Java, nhưng vị trí của nó ảnh hưởng tới khả năng đọc và kiểm thử. Chương tổng hợp cuối mô-đun sẽ quay lại đánh đổi này.

Chữ ký hẹp:

```java
static void moveDogs(List<Dog> source, List<Dog> target)
```

chỉ dùng được khi cả hai phía chính xác là `List<Dog>`.

Chữ ký linh hoạt:

```java
static void moveDogs(
        List<? extends Dog> source,
        List<? super Dog> target)
```

cho phép nguồn chứa subtype của `Dog` và đích là cấu trúc chứa `Dog` hoặc một supertype của `Dog`.

JDK dùng mẫu này rộng rãi. Ví dụ, `Collections.copy` coi nguồn là nơi cung cấp dữ liệu và đích là nơi tiếp nhận dữ liệu.

Không nên áp PECS máy móc:

- nếu tham số cần cả đọc và ghi cùng một `T`, `List<T>` chính xác hoặc tham số kiểu có tên có thể rõ hơn;
- nếu wildcard làm chữ ký khó hiểu nhưng không tăng khả năng tái sử dụng, không cần thêm;
- tham số kiểu có tên thích hợp khi kiểu trả về hoặc nhiều đầu vào phải liên hệ trực tiếp với nhau.

Đặc biệt, thường **tránh wildcard ở kiểu trả về công khai** nếu có thể trả về một kiểu cụ thể hơn. Kiểu trả về như `List<? extends Animal>` buộc bên gọi tiếp tục mang kiểu chưa biết và xử lý wildcard ở phía của họ. Wildcard thường hữu ích nhất ở **ranh giới đầu vào**, nơi API muốn chấp nhận nhiều parameterized type hợp lệ.

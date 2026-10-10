### `remove(index)` khác `remove(value)` như thế nào?

`List` nạp chồng phương thức `remove`, nên với kiểu số rất dễ gọi nhầm:

```java
List<Integer> numbers = new ArrayList<>(List.of(10, 20, 30));

numbers.remove(1);                  // xóa phần tử tại index 1 -> 20
numbers.remove(Integer.valueOf(10)); // xóa value 10
```

Đối số kiểu nguyên thủy `int` chọn phiên bản `remove(int index)`. Muốn xóa một `Integer` theo giá trị, hãy truyền rõ một đối tượng `Integer`.

### `subList` là khung nhìn, không phải bản sao

```java
List<String> source = new ArrayList<>(List.of("A", "B", "C", "D"));
List<String> middle = source.subList(1, 3); // [B, C]

middle.set(0, "X");
System.out.println(source); // [A, X, C, D]
```

`subList(from, to)` trả về một **khung nhìn liên kết với dữ liệu gốc** của một vùng trong List gốc. Thay đổi dữ liệu hợp lệ qua khung nhìn phản ánh vào nguồn và ngược lại. Nếu List nền bị thay đổi cấu trúc bằng bất kỳ cách nào ngoài thông qua sub-list được trả về, ngữ nghĩa của sub-list đó trở thành **không xác định**. Một lớp triển khai cụ thể có thể phát hiện trạng thái không khớp và ném `ConcurrentModificationException`, nhưng CME không phải là quy ước mà `subList` bảo đảm.

Nếu cần dữ liệu độc lập, hãy tạo bản sao rõ ràng:

```java
List<String> snapshot = new ArrayList<>(source.subList(1, 3));
```

### `Arrays.asList` không giống `ArrayList`, cũng không giống `List.of`

```java
Order[] array = {orderA, orderB};

List<Order> fixedSize = Arrays.asList(array);
fixedSize.set(0, orderC);  // hợp lệ và array[0] cũng đổi

// fixedSize.add(orderD);    // UnsupportedOperationException
// fixedSize.remove(orderB); // UnsupportedOperationException

List<Order> mutableCopy = new ArrayList<>(fixedSize);
List<Order> unmodifiableCopy = List.copyOf(fixedSize);
```

`Arrays.asList(array)` tạo một **List cố định kích thước, liên kết với mảng nguồn**: được thay phần tử bằng `set`, nhưng không được đổi kích thước bằng `add/remove`. `List.of(...)`/`List.copyOf(...)` tạo List không cho phép sửa; còn `new ArrayList<>(...)` tạo một List có thể thay đổi và độc lập về cấu trúc.

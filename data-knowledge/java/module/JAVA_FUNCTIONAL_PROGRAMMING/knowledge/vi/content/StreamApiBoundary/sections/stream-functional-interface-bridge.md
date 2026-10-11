Stream API cần bên gọi cung cấp các hành vi như "giữ lại phần tử này", "biến đổi giá trị này" hoặc "thực hiện hành động này với từng giá trị". Giao diện hàm giúp các hành vi đó có kiểu Java cụ thể.

Ví dụ, bên gọi có thể truyền các hợp đồng đã học từ `java.util.function`:

```java
Predicate<String> keep = name -> !name.isBlank();
Function<String, String> normalize = String::trim;
Consumer<String> print = System.out::println;

names.stream().filter(keep);
names.stream().map(normalize);
names.stream().forEach(print);
```

Mối liên hệ quan trọng trong mô-đun này nằm ở hệ thống kiểu: lambda và tham chiếu phương thức trở thành giá trị của các giao diện hàm đó, rồi được truyền vào phương thức của Stream.

Cách Stream lên lịch, trì hoãn, ghép hoặc thực thi các thao tác thuộc kiến thức riêng của Stream API.

Không hợp lệ:

```java
// List<int> numbers;
// Box<double> value;
```

Type argument phải là kiểu tham chiếu (reference type):

```java
List<Integer> numbers = new ArrayList<>();
Box<Double> value = new Box<>();
```

Autoboxing giúp cú pháp sử dụng thuận tiện:

```java
numbers.add(1); // int -> Integer
```

Nhưng wrapper vẫn là object, nên có khác biệt về cấp phát bộ nhớ, định danh, khả năng nhận `null` và chi phí so với primitive. Generics không biến `List<Integer>` thành một `int[]` chuyên biệt cho primitive.

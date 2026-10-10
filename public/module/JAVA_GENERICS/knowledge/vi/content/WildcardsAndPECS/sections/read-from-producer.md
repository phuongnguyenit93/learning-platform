`List<? extends Animal>` có thể là:

```java
List<Animal>
List<Dog>
List<Cat>
```

Phương thức có thể đọc:

```java
Animal animal = source.get(0);
```

Vì mọi khả năng đều sinh ra ít nhất một `Animal`.

Nhưng không thể ghi một `Dog`:

```java
// source.add(new Dog()); // compile error
```

List thật có thể là `List<Cat>`.

Do đó “extends = read-only” chỉ là cách nhớ gần đúng. API vẫn có thể thực hiện thao tác không phụ thuộc kiểu phần tử như `clear()` hoặc xóa theo chỉ số. Điều bị hạn chế là **ghi một giá trị phần tử cụ thể** khi kiểu chính xác chưa biết.

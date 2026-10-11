Mảng trong Java là hiệp biến (covariant):

```java
Integer[] integers = {1, 2};
Number[] numbers = integers; // compile được
```

Nhưng JVM phải kiểm tra kiểu khi ghi ở lúc chạy:

```java
numbers[0] = 3.14; // ArrayStoreException
```

Mảng giữ kiểu phần tử (component type) ở lúc chạy nên JVM có thể phát hiện việc ghi sai kiểu.

Generics chọn hướng khác:

```java
List<Integer> integers = new ArrayList<>();
// List<Number> numbers = integers; // compile error
```

Hệ thống kiểu chặn quan hệ nguy hiểm ngay khi biên dịch, thay vì cho phép rồi dựa vào kiểm tra lúc ghi ở runtime.

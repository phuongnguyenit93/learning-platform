`java.util.function` là thư viện chính cho các dạng hàm tổng quát, nhưng không phải mọi giao diện hàm của JDK đều nằm trong gói này.

Ví dụ:

```java
Runnable task = () -> doWork();
Callable<String> loader = () -> loadValue();
Comparator<String> byLength =
        (left, right) -> Integer.compare(left.length(), right.length());
```

`Runnable`, `Callable<V>` và `Comparator<T>` thuộc các gói hoặc miền API khác nhau, nhưng mỗi giao diện đều có một hợp đồng hàm tương thích nên vẫn có thể làm kiểu đích cho lambda hoặc tham chiếu phương thức.

Điều cần học là nhận diện **hợp đồng giao diện hàm**, không phải ghi nhớ rằng mọi kiểu đích của lambda đều phải đến từ `java.util.function`.

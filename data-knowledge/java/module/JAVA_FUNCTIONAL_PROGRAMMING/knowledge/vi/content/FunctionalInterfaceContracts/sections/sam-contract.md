SAM là viết tắt của **Single Abstract Method**. Với người mới, có thể bắt đầu bằng mô hình đơn giản: lambda cần một thao tác trừu tượng duy nhất để triển khai.

```java
@FunctionalInterface
interface Transformer<T, R> {
    R apply(T value);
}
```

`Transformer<T, R>` có một thao tác trừu tượng là `apply`, nên một lambda tương thích có thể cung cấp hành vi đó:

```java
Transformer<String, Integer> length = text -> text.length();
```

Tuy nhiên, Java không xác định giao diện hàm bằng cách đếm máy móc mọi khai báo `abstract`. Kế thừa và các phương thức tương ứng với phương thức thực thể `public` của `Object` có thể làm thay đổi cách xác định hợp đồng SAM.

Trong thực tế, hãy giữ mô hình tư duy này: sau khi Java áp dụng đầy đủ các quy tắc giao diện hàm, phải còn lại một hợp đồng trừu tượng thống nhất để lambda hoặc tham chiếu phương thức triển khai.

Mảng tham chiếu trong Java có tính hiệp biến:

```java
String[] strings = new String[1];
Object[] objects = strings;
```

Phép gán này biên dịch được, nhưng kiểu thực tế của mảng ở thời điểm chạy vẫn là `String[]`.

```java
objects[0] = Integer.valueOf(1); // ArrayStoreException
```

Trình biên dịch cho phép quan hệ kiểu này, còn kiểm tra ở thời điểm chạy bảo vệ kiểu thành phần thực tế của mảng.

Đây là một khác biệt quan trọng với collection generic, vốn bất biến theo cách khác.

### Vì sao lỗi xuất hiện ở thời điểm chạy?

Biến `objects` có kiểu lúc biên dịch `Object[]`, nên trình biên dịch cho phép gán `Integer`. Nhưng đối tượng thực tế vẫn là `String[]` và mảng mang kiểu thành phần ở thời điểm chạy, vì vậy JVM phải kiểm tra mỗi lần ghi để giữ an toàn kiểu.

```text
góc nhìn lúc biên dịch: Object[]
đối tượng lúc chạy:       String[]
ghi Integer
        ↓
kiểm tra lúc chạy → ArrayStoreException
```

Điều này minh họa rõ ranh giới kiểu tĩnh so với kiểu lúc chạy mà chương cuối sẽ tổng kết.

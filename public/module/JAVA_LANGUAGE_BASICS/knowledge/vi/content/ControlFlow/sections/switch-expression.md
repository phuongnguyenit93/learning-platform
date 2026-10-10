Biểu thức `switch` trả về giá trị:

```java
String label = switch (status) {
    case NEW -> "new";
    case DONE -> "done";
    default -> "other";
};
```

Với khối `case` cần nhiều câu lệnh, `yield` trả giá trị cho biểu thức `switch`:

```java
int result = switch (code) {
    case 1 -> 10;
    default -> {
        int computed = compute();
        yield computed;
    }
};
```

Dạng mũi tên tránh fall-through ngoài ý muốn của `switch` dạng dấu `:`.

Biểu thức `switch` phải có khả năng tạo ra một giá trị cho mọi đường thực thi cần thiết. Điều này khiến bảng quyết định rõ hơn và trình biên dịch có thể kiểm tra tính đầy đủ trong các trường hợp phù hợp.

```java
int fee = switch (type) {
    case BASIC -> 10;
    case PREMIUM -> 0;
    default -> throw new IllegalArgumentException("unsupported");
};
```

`yield` chỉ dùng để trả giá trị từ khối của biểu thức `switch`; nó không giống `return` khỏi phương thức.

### Java 21 còn mở rộng `switch`

Java 21 còn cho phép `switch` phân loại giá trị tham chiếu bằng pattern. Ở chặng này chỉ cần nhận biết khả năng đó; **type pattern, kiểu lúc chạy và phạm vi của biến pattern** được giải thích sau khi người học đã có mô hình hệ thống kiểu ở chương Ranh giới giữa kiểm tra lúc biên dịch và lúc chạy.

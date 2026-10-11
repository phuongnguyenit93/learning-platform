Hai ví dụ quen thuộc:

- lambda: compiler có thể emit invokedynamic và bootstrap qua `LambdaMetafactory`;
- string concatenation hiện đại: runtime có thể dùng `StringConcatFactory`.

Ví dụ source:

```java
Function<String, String> upper =
        value -> value.toUpperCase();
```

Người học không nên suy ra rằng “lambda chính là invokedynamic”. Lambda là **language feature**; invokedynamic là một cơ chế runtime/linkage mà compiler/JDK có thể dùng để hiện thực feature đó.

Tương tự:

```java
String result = "Hello " + name;
```

không có nghĩa business code đang chủ động dùng Dynamic Runtime API.

Ranh giới này giúp tránh biến chapter thành lịch sử cách triển khai của từng Java feature.

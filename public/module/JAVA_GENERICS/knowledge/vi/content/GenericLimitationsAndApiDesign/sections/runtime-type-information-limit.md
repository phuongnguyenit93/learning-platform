Erasure giới hạn những câu hỏi có thể trả lời trực tiếp ở runtime về `T` hoặc một type argument cụ thể.

Ví dụ, không thể dùng type parameter như một class literal:

```java
static <T> void inspect() {
    // Class<?> type = T.class; // compile error
}
```

Và với một tham chiếu quá rộng, runtime không thể xác minh tùy ý type argument cụ thể:

```java
Object value = new ArrayList<String>();
// value instanceof List<String> // compile error
```

Tương tự, không thể kiểm tra trực tiếp `instanceof T` vì `T` không còn là một danh tính class độc lập ở runtime sau erasure:

```java
// if (value instanceof T) { } // compile error
```

Nhưng từ Java 16, một số parameterized `instanceof` vẫn hợp lệ khi kiểu tĩnh cho phép phép ép kiểu được kiểm tra, như `List<Integer> → ArrayList<Integer>`. Giới hạn thật sự không phải “mọi parameterized type đều bị cấm với instanceof”, mà là runtime **không thể tự xác minh tùy ý một type argument cụ thể đã bị erasure**.

Khi mã generic thực sự cần một runtime type token, API thường nhận nó từ bên gọi, chẳng hạn `Class<T>`, thay vì cố suy ra từ `T`.

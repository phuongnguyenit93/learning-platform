**Verification** kiểm tra biểu diễn class có đáp ứng structural/type-safety constraints cần thiết để JVM có thể thực thi an toàn hay không.

**Preparation** tạo static field storage và đặt default value theo JVM rules trước khi Java-level initializer chạy.

**Resolution** chuyển symbolic reference thành runtime reference trực tiếp hơn tới class/interface/field/method tương ứng.

Ví dụ:

```java
static int port = 8080;
```

Conceptually:

```text
preparation   → storage tồn tại, value ban đầu = 0
initialization→ chạy initializer, value = 8080
```

Với `static final` constant variable có `ConstantValue` attribute, constant value cũng được gán trong **initialization procedure**, trước khi JVM gọi `<clinit>`; nó vẫn không phải là bước preparation. Vì vậy preparation nên nhớ đơn giản là “tạo static storage + default value”, còn các giá trị Java-level thực sự được thiết lập trong initialization.

Tách preparation khỏi initialization giúp hiểu nhiều câu hỏi về static state mà source-level mental model thường che khuất.

Việc dùng raw type thường làm compiler không thể chứng minh đầy đủ an toàn kiểu:

```java
List raw = new ArrayList<String>();
raw.add(123); // unchecked call warning
```

Cảnh báo không phải “compiler khó tính”. Nó báo rằng một đảm bảo generic đang bị vượt qua mà compiler không thể kiểm chứng đầy đủ.

Java có cơ chế để bỏ qua có chủ đích (suppress) cảnh báo của compiler, nhưng cú pháp annotation cụ thể được học ở module Annotation. Ở đây điều quan trọng là: **đừng che cảnh báo trước khi hiểu vì sao compiler không chứng minh được an toàn kiểu**.

Hãy xác định:

- cảnh báo đến từ ranh giới mã cũ nào;
- có thể đổi API sang parameterized type không;
- nếu bắt buộc ép kiểu, có điều kiện lúc chạy nào chứng minh phép ép kiểu an toàn không.

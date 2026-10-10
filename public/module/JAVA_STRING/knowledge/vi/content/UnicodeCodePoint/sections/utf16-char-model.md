`char` là một **đơn vị mã UTF-16 (code unit) 16-bit**.

Nhiều ký tự Unicode nằm trong **Mặt phẳng Đa ngữ Cơ bản (Basic Multilingual Plane - BMP)** có thể biểu diễn bằng một đơn vị mã. Nhưng ký tự ngoài vùng đó cần hai đơn vị mã.

Vì vậy:

```java
text.length();
```

trả số đơn vị mã UTF-16, không đảm bảo là số điểm mã Unicode hay số ký tự người dùng nhìn thấy.

Ví dụ:

```java
String text = "A😀";

text.length(); // 3 đơn vị mã: 'A' + một cặp surrogate
```

Đây là nền tảng để hiểu vì sao các API dựa trên chỉ số như `charAt` và `substring` dùng vị trí theo đơn vị mã UTF-16.

Từ Java 9, biến cục bộ đã tồn tại có thể được dùng trực tiếp trong phần khai báo tài nguyên nếu nó là `final` hoặc effectively final:

```java
InputStream in = Files.newInputStream(path);

try (in) {
    consume(in);
}
```

Effectively final nghĩa là sau khi được gán giá trị, biến không bị gán lại.

Không hợp lệ về mặt effective-final:

```java
InputStream in = Files.newInputStream(path);
in = anotherStream;

try (in) {
    ...
}
```

### Quyền sở hữu tài nguyên vẫn cần rõ ràng

Cú pháp cho phép dùng biến có sẵn không có nghĩa mọi phương thức nhận `AutoCloseable` đều nên đóng nó.

Hãy hỏi:

```text
Ai tạo tài nguyên?
Ai sở hữu vòng đời của tài nguyên?
Ai có trách nhiệm đóng?
```

Nếu phương thức chỉ “mượn” tài nguyên do bên gọi sở hữu, tự đóng nó có thể vi phạm hợp đồng của bên gọi.

Chương tiếp theo chuyển từ cơ chế quản lý lỗi/tài nguyên sang thiết kế API và miền nghiệp vụ: khi nào một kiểu ngoại lệ tùy chỉnh thực sự bổ sung ý nghĩa?

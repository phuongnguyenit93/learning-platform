`Consumer<T>` biểu diễn hành vi không trả về kết quả theo hợp đồng. `andThen` ghép nhiều hành vi `Consumer` để chạy tuần tự.

```java
Consumer<String> log = value -> System.out.println("LOG: " + value);
Consumer<String> audit = value -> auditStore.add(value);

Consumer<String> logAndAudit = log.andThen(audit);
```

`Consumer` đầu tiên chạy trước `Consumer` thứ hai. Nếu hành vi đầu ném ngoại lệ, hành vi sau không được thực thi.

Vì `Consumer` thường chứa tác dụng phụ, thứ tự của chúng có thể quan sát được. Việc kết hợp nên làm trình tự đó rõ hơn, không che giấu một chuỗi thao tác bên ngoài dễ lỗi.

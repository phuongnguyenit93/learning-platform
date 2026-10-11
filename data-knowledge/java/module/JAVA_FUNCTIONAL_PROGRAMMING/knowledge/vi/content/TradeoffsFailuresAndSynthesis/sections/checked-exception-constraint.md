Lambda hoặc tham chiếu phương thức phải tuân theo hợp đồng `throws` của kiểu hàm đích. Các giao diện chuẩn như `Function<T, R>` không khai báo tùy ý các ngoại lệ được kiểm tra (checked exception).

```java
Function<Path, String> reader = path -> Files.readString(path); // không biên dịch
```

`Files.readString` có thể ném `IOException`, nhưng `Function.apply` không khai báo `IOException`. Vì vậy lambda không thể đơn giản truyền ngoại lệ được kiểm tra đó ra ngoài qua kiểu đích này.

Đây là vấn đề của hợp đồng kiểu, không phải hạn chế riêng của cú pháp lambda. Một lớp có tên cài đặt cùng `Function` cũng gặp đúng ràng buộc đó.

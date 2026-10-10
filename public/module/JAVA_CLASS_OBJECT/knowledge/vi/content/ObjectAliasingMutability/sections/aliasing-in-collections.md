Một phương thức getter trả trực tiếp tập hợp nội bộ có thể thay đổi sẽ làm lộ tham chiếu. Với ví dụ `BankAccount` xuyên suốt:

```java
List<String> tags() {
    return tags;
}
```

Bên gọi có thể thay đổi `tags` mà không đi qua quy tắc của `BankAccount`.

Tương tự, nếu hàm khởi tạo lưu thẳng tham chiếu tới tập hợp đầu vào có thể thay đổi, bên gọi vẫn có thể sửa tập hợp đó sau này.

Chương tiếp theo giải quyết vấn đề này bằng **tính bất biến và sao chép phòng vệ**.

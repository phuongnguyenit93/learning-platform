### KHÁI NIỆM

Phương thức `abstract` chỉ khai báo chữ ký phương thức mà không có phần thân:

```java
abstract void pay(int amount);
```

Một lớp con cụ thể phải bảo đảm mọi yêu cầu `abstract` đã được đáp ứng bằng phần triển khai hợp lệ trước khi có thể tạo đối tượng. Lớp con không nhất thiết phải tự khai báo lại phương thức nếu nó đã kế thừa một phần triển khai cụ thể tương thích từ một lớp trung gian trong hệ phân cấp.

### CƠ CHẾ

Phương thức `abstract` vẫn tuân theo các quy tắc ghi đè (override) thông thường của Java:

- mức truy cập phải tương thích;
- kiểu trả về phải tương thích, bao gồm kiểu trả về đồng biến (covariant return) khi áp dụng;
- ngoại lệ được kiểm tra (checked exception) phải tuân quy tắc override;
- `@Override` giúp trình biên dịch kiểm tra đúng quan hệ ghi đè.

`abstract` không tạo ra một cơ chế gọi phương thức riêng. Khi lớp con cung cấp phần triển khai, lời gọi phương thức của đối tượng vẫn sử dụng **phân phối động (dynamic dispatch)** như các phương thức ghi đè khác.

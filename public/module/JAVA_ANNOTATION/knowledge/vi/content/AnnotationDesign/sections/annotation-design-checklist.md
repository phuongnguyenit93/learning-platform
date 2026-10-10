Trước khi tạo hoặc sử dụng một Annotation, hãy lần lượt hỏi:

```text
1. Annotation đang mô tả điều gì?
2. Vì sao thông tin này nên nằm sát mã nguồn?
3. Ai là thành phần đọc?
4. Thành phần đọc chạy khi biên dịch hay lúc chạy?
5. Annotation được phép đặt ở đâu?
6. Siêu dữ liệu phải tồn tại đến giai đoạn nào?
7. Có cần lặp lại hay tham gia tra cứu kế thừa class không?
8. Thành phần đọc sẽ kiểm tra, sinh mã, đăng ký hay tạo hành vi gì?
9. API, interface, đối tượng hoặc cấu hình tường minh có dễ hiểu hơn không?
10. Khi đọc mã nguồn, lập trình viên có tìm được quy tắc và hành vi liên quan không?
```

Nếu trả lời được các câu hỏi trên, ta có thể đi từ “thấy một `@Something`” đến một mô hình tư duy đầy đủ:

```text
Annotation
→ siêu dữ liệu có cấu trúc
→ có cấu trúc dữ liệu
→ có quy tắc về vị trí sử dụng
→ có vòng đời
→ có thành phần đọc
→ thành phần đọc tạo ra hành vi
```

Khi đi sâu vào kiểm tra lúc chạy, module `reflection` là nơi sở hữu cơ chế Reflection chi tiết. Module Annotation dừng ở quy tắc siêu dữ liệu, cách thiết kế Annotation và cách các thành phần đọc tương tác với quy tắc đó.

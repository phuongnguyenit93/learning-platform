### KHÁI NIỆM

`Throwable` là lớp gốc của cơ chế ngoại lệ trong Java. Mô hình rút gọn:

```text
Throwable
├── Error
└── Exception
    └── RuntimeException
```

Mọi giá trị được `throw` phải có kiểu tương thích với `Throwable`. Một `Throwable` có hai vai trò cùng lúc:

```text
tín hiệu điều khiển luồng
→ báo rằng đường chạy bình thường bị gián đoạn

đối tượng chẩn đoán
→ mang kiểu, thông điệp, stack trace, cause và có thể có suppressed exception
```

Đây là lý do ngoại lệ không chỉ là “một đối tượng chứa lỗi”. Khi nó được ném, Java còn thay đổi luồng điều khiển để tìm nơi xử lý phù hợp.

### Checked và unchecked nằm ở đâu?

Phân loại theo quy tắc tại thời điểm biên dịch có thể nhìn như sau:

```text
Throwable
├── Error                         → unchecked
└── Exception
    ├── RuntimeException          → unchecked
    └── các Exception còn lại     → checked
```

Nói chính xác hơn: các lớp thuộc nhánh `RuntimeException` **và** `Error` không chịu quy tắc bắt-hoặc-khai-báo của checked exception. Mọi lớp `Throwable` còn lại đều là checked theo quy tắc ngôn ngữ, kể cả trường hợp hiếm khi một lớp kế thừa trực tiếp từ `Throwable` thay vì từ `Exception`.

Trong mã nguồn ứng dụng thông thường, nên kế thừa `Exception` hoặc `RuntimeException` thay vì tạo lớp con trực tiếp của `Throwable`; sơ đồ trên cố ý tập trung vào cấu trúc mà người học sẽ gặp trong thực tế.

Điểm này quan trọng vì “unchecked” không đồng nghĩa với “chỉ RuntimeException”; `Error` cũng không bị trình biên dịch bắt buộc bắt hoặc khai báo.

### CƠ CHẾ

Khi mã nguồn được thực thi:

```java
throw new IllegalStateException("order state is invalid");
```

đường chạy bình thường dừng tại `throw`. Java không chuyển sang câu lệnh kế tiếp trong khối lệnh mà bắt đầu tìm khối xử lý phù hợp. Nếu phương thức hiện tại không xử lý, exception tiếp tục lan truyền lên ngăn xếp lời gọi.

Ta sẽ đi sâu vào cơ chế đó ở chương **throw, throws và sự lan truyền Exception**.

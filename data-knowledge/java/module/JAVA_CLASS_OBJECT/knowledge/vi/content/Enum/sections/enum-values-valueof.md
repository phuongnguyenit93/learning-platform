`values()` trả các hằng theo thứ tự khai báo; `valueOf(String)` tìm theo đúng tên hằng đã khai báo.

```java
AccountStatus[] all = AccountStatus.values();
AccountStatus status = AccountStatus.valueOf("ACTIVE");
```

`name()` là tên định danh đã khai báo. `ordinal()` chỉ là vị trí khai báo và **không nên dùng làm mã nghiệp vụ ổn định hoặc giá trị lưu trong cơ sở dữ liệu**, vì đổi thứ tự hằng sẽ làm `ordinal()` thay đổi.

Nếu cần một mã bên ngoài ổn định, hãy định nghĩa trường riêng.

Chương tiếp theo chuyển từ “đối tượng là gì” sang “sao chép đối tượng nghĩa là sao chép tham chiếu hay sao chép trạng thái?”.

Trình biên dịch phải chứng minh biến cục bộ đã được gán trước khi đọc:

```java
int x;
// System.out.println(x); // không hợp lệ: x chưa được gán
x = 1;
System.out.println(x);  // hợp lệ
```

Đây là **bảo đảm ở thời điểm biên dịch**, không phải cơ chế khởi tạo mặc định ở thời điểm chạy. Khi xuất hiện nhánh và vòng lặp, trình biên dịch còn phải phân tích mọi đường thực thi có thể xảy ra; phần đó được nối lại sau khi học Luồng điều khiển.

Chương tiếp theo làm rõ giá trị `null` trước khi đi tới kiểu bao và mở hộp.

Để một phương thức ứng viên có thể áp dụng, đối số có thể trải qua các chuyển đổi mà Java cho phép trong ngữ cảnh gọi phương thức, như:

- chuyển đổi đồng nhất (identity conversion);
- mở rộng kiểu nguyên thủy;
- mở rộng kiểu tham chiếu;
- đóng hộp/mở hộp trong giai đoạn phù hợp;
- chuyển đổi `varargs` ở giai đoạn cuối.

Không phải mọi phép ép kiểu hợp lệ đều được trình biên dịch tự thực hiện trong lời gọi phương thức.

Ví dụ:

```java
void use(long value) { }
use(10); // int được mở rộng thành long

void boxed(Integer value) { }
boxed(10); // đóng hộp
```

Nhưng trình biên dịch không tự thu hẹp kiểu tùy ý:

```java
void useByte(byte value) { }
int x = 1;
// useByte(x); // không biên dịch được
useByte((byte) x);
```

Điều này quan trọng vì quá trình chọn phương thức nạp chồng dùng **các phép chuyển đổi mà ngôn ngữ cho phép**, không dựa vào việc “giá trị ở thời điểm chạy tình cờ vẫn an toàn”.

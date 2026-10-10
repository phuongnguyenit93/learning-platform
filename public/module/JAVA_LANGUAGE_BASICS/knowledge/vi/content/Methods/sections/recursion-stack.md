Phương thức đệ quy gọi lại chính nó hoặc tham gia một chu kỳ lời gọi. Mỗi lần gọi cần một frame mới trên ngăn xếp.

Nếu không có điều kiện dừng hoặc độ sâu quá lớn, chương trình có thể gặp `StackOverflowError`.

Đệ quy phù hợp tự nhiên với một số bài toán cây hoặc chia để trị, nhưng vòng lặp có thể đơn giản hơn và an toàn hơn về ngăn xếp cho quá trình lặp tuyến tính dài.

Ví dụ:

```java
int factorial(int n) {
    if (n <= 1) {
    return 1;          // điều kiện dừng
    }
    return n * factorial(n - 1); // bước đệ quy
}
```

Mô hình tư duy:

```text
factorial(3)
→ frame n=3 chờ factorial(2)
→ frame n=2 chờ factorial(1)
→ frame n=1 trả 1
→ lần lượt quay lui: 2 → 6
```

Mỗi lời gọi giữ trạng thái riêng. Java không bảo đảm tối ưu hóa tail-call, nên độ sâu đệ quy vẫn là một giới hạn thực tế ở thời điểm chạy.

Chương tiếp theo xem cú pháp đặc biệt cho phương thức nhận số đối số thay đổi: `varargs`.

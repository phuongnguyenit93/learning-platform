# Interruption & Cooperative Cancellation trong Java

Phần này học cách **yêu cầu một Thread dừng lại có kiểm soát**.

Mental model quan trọng nhất:

```text
interrupt()
    ≠ kill thread

interrupt()
    = gửi tín hiệu interruption
      để code đang chạy tự hợp tác xử lý
```

Sau phần này cần trả lời được:

- `interrupt()` thực sự làm gì.
- Vì sao busy loop phải chủ động kiểm tra interrupt flag.
- `isInterrupted()` khác `Thread.interrupted()` ở đâu.
- Vì sao `sleep()`, `wait()` và `join()` có thể ném `InterruptedException`.
- Vì sao interrupt flag thường trở về `false` khi `InterruptedException` được ném.
- Khi nào cần restore interrupt status.
- Vì sao cleanup nên nằm trong `finally`.
- Những trạng thái nào không thể thoát ra chỉ bằng `interrupt()`.
- `volatile boolean stop` khác `interrupt()` ở điểm nào khi worker đang block.

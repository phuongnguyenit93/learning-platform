Không.

`interrupt()` gửi cooperative cancellation signal.

Code đang chạy phải:

- kiểm tra interrupt status; hoặc
- đang ở interruptible blocking operation; hoặc
- propagate/restore interruption đúng cách.

Một tight loop không kiểm tra interrupt sẽ không tự dừng chỉ vì caller gọi `interrupt()`.

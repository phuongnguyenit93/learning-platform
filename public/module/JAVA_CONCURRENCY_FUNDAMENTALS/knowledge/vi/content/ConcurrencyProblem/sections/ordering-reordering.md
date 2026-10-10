Compiler, JIT và CPU có quyền tối ưu execution miễn là behavior quan sát được vẫn tuân thủ Java Memory Model.

Vì vậy programmer không nên suy luận:

```text
dòng 1 nằm trên dòng 2 trong source
→ Thread khác chắc chắn quan sát dòng 1 trước dòng 2
```

nếu giữa các Thread không có synchronization rule tương ứng.

Ví dụ message publication sai:

```java
int data = 0;
boolean ready = false;

// writer
data = 42;
ready = true;

// reader
if (ready) {
    use(data);
}
```

Không có volatile/lock/other happens-before edge giữa writer và reader.

Code như vậy có **data race**.

### Vì sao module không tạo endpoint "chắc chắn bắt được reordering"?

Một stress test có thể đôi lúc quan sát outcome lạ và đôi lúc không.

Nhưng:

```text
không quan sát được outcome lạ
≠
code được JMM đảm bảo đúng
```

Do đó chapter này dùng `volatile-publication` như positive experiment: thay vì săn behavior không được đảm bảo, ta chứng minh cách tạo ra một guarantee rõ ràng.

**Kết luận:** correctness đa luồng phải dựa trên happens-before, không dựa trên xác suất "máy của tôi chạy đúng".

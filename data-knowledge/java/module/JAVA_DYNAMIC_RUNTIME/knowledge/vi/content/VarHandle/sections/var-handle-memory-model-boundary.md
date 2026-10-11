VarHandle định nghĩa access modes có memory-ordering effects khác nhau, nhưng module này chỉ thiết lập vocabulary và API boundary.

Ví dụ:

```text
plain
opaque
acquire/release
volatile
```

Để trả lời chính xác:

- read/write nào happens-before read/write nào;
- acquire/release tạo ordering ra sao;
- CAS loop có linearizable không;
- publication pattern có safe không;

cần dùng Java Memory Model và cách suy luận của Concurrency.

`VarHandle` cũng cung cấp các thao tác fence như `acquireFence`, `releaseFence`, `fullFence` và các biến thể tương ứng. Ở đây chỉ cần nhận diện chúng là primitive về ordering; cách đặt fence đúng và chứng minh quan hệ memory ordering thuộc Concurrency.

Ranh giới của module:

```text
Dynamic Runtime
→ shape của VarHandle + access modes + cơ chế invocation

Concurrency
→ hệ quả về tính đúng đắn của memory ordering
```

Đây là boundary có chủ đích để tránh dạy JMM nửa vời trong một chapter API.

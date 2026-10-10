Khi method được redefine/retransform trong lúc đang có lời gọi đang chạy, JVM **không chuyển stack frame đang hoạt động sang bytecode mới giữa chừng**.

Ví dụ:

~~~text
Thread A đi vào OrderService.placeOrder()
        ↓
bytecode cũ đang chạy

Thread B kích hoạt retransform
        ↓
định nghĩa mới được cài

Thread A
→ tiếp tục bytecode cũ cho lời gọi hiện tại

lời gọi mới
→ dùng bytecode mới
~~~

Hệ quả là trong một khoảng ngắn, cùng một method có thể có lời gọi cũ đang chạy và lời gọi mới dùng định nghĩa mới.

Thiết kế agent/probe phải chịu được giai đoạn chuyển tiếp này. Đừng giả định “retransform trả về rồi thì mọi stack frame đều đang chạy code mới”.

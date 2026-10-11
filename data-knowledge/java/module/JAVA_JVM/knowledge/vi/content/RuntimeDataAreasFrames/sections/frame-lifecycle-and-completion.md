Frame được tạo mỗi khi method được invoke và bị hủy khi invocation hoàn tất.

Hai kiểu completion:

- **normal completion**: method return bình thường, có thể mang return value cho caller;
- **abrupt completion**: method throw exception không được handle trong chính invocation đó.

Khi exception propagates, current frame có thể bị discard và JVM tiếp tục tìm handler ở caller frames theo exception-dispatch rules.

```text
caller frame
   ↓ invokes
callee frame
   ├─ normal return → result về caller
   └─ uncaught exception → callee frame bỏ, exception propagate
```

Frame lifecycle vì vậy gắn chặt với call stack và exception propagation, không chỉ với “method bắt đầu/kết thúc”.

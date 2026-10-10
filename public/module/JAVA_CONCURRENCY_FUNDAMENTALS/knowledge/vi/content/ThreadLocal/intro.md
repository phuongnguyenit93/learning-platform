# ThreadLocal & Context Propagation

`ThreadLocal<T>` cung cấp một cách gắn một value với **Thread hiện tại**.

Mental model nên dùng:

```text
Thread
→ có ThreadLocal-associated storage
→ ThreadLocal key dùng để truy cập value tương ứng của Thread đó
```

Không nên học thành:

```text
ThreadLocal = copy một biến shared cho từng Thread
```

và cũng không phải:

```text
ThreadLocal = công cụ giải quyết visibility của shared state
```

ThreadLocal thường **tránh chia sẻ** một loại context, thay vì đồng bộ truy cập vào cùng state.

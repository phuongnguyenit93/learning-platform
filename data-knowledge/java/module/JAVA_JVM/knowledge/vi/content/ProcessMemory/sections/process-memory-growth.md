Process memory có thể tăng vì nhiều nguồn độc lập với live Java heap:

- thêm platform threads;
- thêm loaded classes/class loaders;
- JIT compilation/code cache;
- direct buffers;
- JNI/native libraries;
- runtime internal structures;
- allocator fragmentation hoặc committed-but-not-currently-used memory.

Vì vậy biểu đồ:

```text
heap used: stable
RSS: rising
```

không mâu thuẫn.

Đây là lúc mô hình tư duy phải chuyển từ “heap leak?” sang “nhóm bộ nhớ nào đang tăng?”. Việc trả lời bằng bằng chứng NMT/OS thuộc Runtime Diagnostics.

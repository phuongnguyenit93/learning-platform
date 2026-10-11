Ba mục tiêu thường xung đột:

**Throughput**
Muốn phần lớn CPU time dành cho ứng dụng thay vì GC.

**Latency / pause time**
Muốn từng khoảng dừng ứng dụng ngắn để request/interaction ít bị gián đoạn.

**Memory footprint**
Muốn runtime giữ ít memory dư thừa.

Không có collector/configuration tối ưu tuyệt đối cả ba. Heap lớn có thể giảm frequency của collection nhưng tăng footprint; concurrent collector giảm pause nhưng có thể dùng thêm CPU/resources.

Do đó câu hỏi đúng không phải “GC nào tốt nhất?” mà là:

```text
workload ưu tiên throughput, latency hay footprint?
SLO và tài nguyên thực tế là gì?
```

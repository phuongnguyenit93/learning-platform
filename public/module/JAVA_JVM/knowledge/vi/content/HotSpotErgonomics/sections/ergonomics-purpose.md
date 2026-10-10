Một JVM implementation phải chạy trên nhiều loại máy và workload. Nếu mọi ứng dụng đều phải tự chọn collector, heap size và compiler policy ngay từ đầu, cấu hình sẽ phức tạp và dễ sai.

**Ergonomics** là cách HotSpot chọn default/heuristic dựa trên platform, tài nguyên và hành vi runtime để ứng dụng có một baseline hợp lý mà không cần hàng chục flag.

Mental model:

```text
machine + JVM version + workload signals
        ↓
ergonomic defaults / adaptive heuristics
        ↓
hành vi runtime
```

Ergonomics không bảo đảm default luôn tối ưu cho mọi SLO. Nó chỉ tạo điểm bắt đầu hợp lý trước khi có bằng chứng cho tuning.

Runtime optimizer có thể tối ưu dựa trên assumption từ profiling, ví dụ một call site trong thực tế chỉ thấy một receiver type trong thời gian dài.

Nếu assumption đủ mạnh, compiled code có thể được specialize. Nhưng workload có thể thay đổi. Khi assumption bị phá vỡ, JVM phải quay lại execution state an toàn hơn — quá trình này thường gọi là **deoptimization**.

```text
profile assumption
→ optimized compiled code
→ new runtime behavior invalidates assumption
→ deopt
→ interpreter/less-optimized state
→ có thể recompile
```

Speculation làm runtime optimization mạnh hơn nhưng cũng giải thích vì sao latency/hiệu năng có thể thay đổi theo từng phase của ứng dụng.

Virtual threads thường giúp **throughput/scalability** khi hệ thống cần giữ rất nhiều concurrent blocking task.

Chúng không tự làm một database query 500 ms trở thành 50 ms.

```text
latency một operation
→ phụ thuộc operation/downstream

concurrent capacity
→ virtual thread có thể giúp tăng mạnh trong workload phù hợp
```

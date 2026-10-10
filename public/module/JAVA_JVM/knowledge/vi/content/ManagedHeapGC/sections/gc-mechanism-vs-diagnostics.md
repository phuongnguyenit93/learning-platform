Module JVM cần giúp người học hiểu **vì sao GC tồn tại và các đánh đổi của collector hoạt động thế nào**. Nhưng khi production có pause cao, allocation pressure hoặc nghi ngờ leak, ta cần bằng chứng.

Boundary:

```text
JVM
→ allocation / reachability / collector concepts / goals

Runtime Diagnostics
→ GC logging
→ heap histogram / heap dump
→ JFR allocation events
→ troubleshooting dựa trên bằng chứng
```

Không nên “tuning bằng cảm giác” chỉ từ theory. Cùng triệu chứng CPU cao có thể do allocation rate, collector choice, heap sizing hoặc hoàn toàn không liên quan GC.

Lý thuyết tạo hypothesis; diagnostics cung cấp bằng chứng để kiểm chứng.

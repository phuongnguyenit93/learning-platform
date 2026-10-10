### corePoolSize

Số worker mà pool cố duy trì theo core policy. Mặc định core worker thường được tạo khi có task, trừ khi chủ động prestart.

### maximumPoolSize

Giới hạn worker tối đa khi pool cần mở rộng sau khi queue không nhận thêm task.

### workQueue

Queue quyết định cách backlog được giữ.

Một queue rất lớn có thể làm `maximumPoolSize` gần như không được dùng vì task cứ tiếp tục được enqueue.

Một bounded queue giúp giới hạn backlog nhưng buộc hệ thống phải có chiến lược khi capacity cạn.

### keepAliveTime

Thời gian worker vượt core được phép idle trước khi bị loại bỏ. Nếu bật `allowCoreThreadTimeOut`, rule có thể áp dụng cho core worker nữa.

Mặc định core worker được giữ lại kể cả khi idle. Khi gọi:

```java
executor.allowCoreThreadTimeOut(true);
```

core worker cũng có thể bị thu hồi sau `keepAliveTime`. Trade-off là giảm resource khi workload thưa nhưng request sau có thể phải trả chi phí tạo worker lại. Nếu workload lên/xuống liên tục, timeout quá ngắn có thể gây thread churn thay vì tiết kiệm hữu ích.

### prestartAllCoreThreads

Tạo sẵn core worker trước khi task tới. Hữu ích khi warm-up latency quan trọng, nhưng đổi lại tạo resource sớm.

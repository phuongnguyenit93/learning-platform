Scheduler quyết định **khi nào task được trigger**; executor/thread quyết định **task chạy ở đâu**.

```text
Schedule / Timer
→ trigger time
→ submit/run task
→ execution thread
```

Không nên thay scheduler bằng:

```java
while (true) {
    Thread.sleep(...);
    runJob();
}
```

vì lifecycle, drift, cancellation và exception handling khó quản lý hơn.

### fixedRate và overlap

Không nên kết luận chung rằng một periodic task chưa chạy xong thì scheduler chắc chắn tạo hàng trăm Thread chạy chồng chính task đó.

Với `ScheduledThreadPoolExecutor`, các lần thực thi liên tiếp của **cùng một periodic task** không chạy đồng thời với chính nó.

Nếu một execution của periodic task để exception thoát ra ngoài, các execution tiếp theo của cùng periodic task bị suppress theo contract của scheduled executor. Vì vậy periodic job production cần error-observation/handling policy rõ ràng, không chỉ scheduling policy.

Trong Spring, overlap thực tế còn phụ thuộc scheduler, số scheduled registration và cách task được dispatch sang executor khác. Phải phân tích configuration cụ thể.

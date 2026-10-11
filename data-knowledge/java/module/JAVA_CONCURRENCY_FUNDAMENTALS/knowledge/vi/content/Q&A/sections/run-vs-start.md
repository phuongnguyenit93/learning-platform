```text
thread.run()
→ method call bình thường trên caller thread

thread.start()
→ bắt đầu lifecycle của Thread
→ JVM gọi run() trên execution mới
```

Một `Thread` object chỉ start một lần.

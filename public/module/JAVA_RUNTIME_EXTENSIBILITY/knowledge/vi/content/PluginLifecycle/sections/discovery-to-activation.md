Discovery chỉ chứng minh rằng provider **có thể được tìm thấy**; nó chưa chứng minh provider sẵn sàng phục vụ.

Flow activation nên tách các bước:

```text
discover
→ validate class/metadata
→ validate compatibility
→ create provider
→ initialize tài nguyên
→ mark ACTIVE
```

Ví dụ host có thể discovery `PdfExporter`, nhưng provider chỉ activate thành công sau khi native font engine hoặc license configuration sẵn sàng.

Đừng publish plugin vào registry phục vụ request trước khi activation hoàn tất.

Nếu nhiều plugin start cùng lúc, cần policy rõ về partial failure:

- fail toàn host nếu required plugin fail;
- bỏ qua optional plugin;
- startup degraded mode;
- retry theo policy riêng.

Selection chỉ nên thấy provider ở trạng thái phù hợp để nhận request.

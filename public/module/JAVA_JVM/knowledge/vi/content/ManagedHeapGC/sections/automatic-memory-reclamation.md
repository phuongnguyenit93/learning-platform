Automatic reclamation nghĩa là ứng dụng không gọi `free(object)` cho heap object. Collector xác định vùng lưu trữ nào có thể tái sử dụng khi object không còn thuộc live graph theo collector semantics.

“Automatic” không có nghĩa:

- GC chạy ngay khi reference cuối biến mất;
- object được reclaim tại thời điểm xác định trước;
- memory lập tức trả lại operating system;
- resource ngoài heap như file/socket tự đóng đúng lúc.

Đây là distinction rất quan trọng:

```text
heap object lifetime
≠ external resource lifetime
```

File, socket, database connection vẫn nên đóng deterministic bằng `try-with-resources` hoặc lifecycle API phù hợp.

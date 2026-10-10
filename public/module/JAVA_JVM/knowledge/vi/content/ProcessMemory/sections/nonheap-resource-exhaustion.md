Application có thể fail vì process/native resource dù Java heap chưa chạm `-Xmx`.

Ví dụ class metadata pressure, không tạo thêm native thread được, direct-buffer/native allocation fail hoặc container memory limit bị vượt.

Failure cuối cùng có thể vẫn xuất hiện dưới dạng `OutOfMemoryError` với message khác nhau hoặc thậm chí process bị OS/container terminate.

Do đó:

```text
OutOfMemoryError
→ category, không phải root cause duy nhất
```

Root cause cần bằng chứng từ error message, giới hạn của tiến trình và diagnostic tools.

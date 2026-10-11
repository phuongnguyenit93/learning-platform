SPI + `ServiceLoader` mới giải quyết **contract + discovery**. Một plugin architecture hoàn chỉnh còn phải trả lời:

```text
provider nào được phép activate?
→ ai quản lý lifecycle?
→ failure của plugin bị cô lập thế nào?
→ dependency nào được share?
→ compatibility được kiểm tra ở đâu?
```

Khi những câu hỏi này xuất hiện, provider không còn chỉ là “một implementation được tìm thấy”, mà trở thành một **plugin** có boundary và lifecycle do host quản lý.

Flow điển hình:

```text
discover
→ validate
→ select
→ initialize
→ activate
→ execute
→ deactivate
→ cleanup
```

Java không cung cấp một universal plugin framework trong `ServiceLoader`. Architecture của application phải xây phần orchestration còn lại trên primitive discovery/module mechanisms.

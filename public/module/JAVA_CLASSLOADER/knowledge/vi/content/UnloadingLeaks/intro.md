# Gỡ nạp class và rò rỉ ClassLoader

Hệ thống plugin có một vòng đời mong muốn:

```text
load plugin
→ run plugin
→ stop plugin
→ bỏ mọi tham chiếu
→ plugin classes có thể được GC/unload
```

Nhưng “xóa plugin khỏi một `Map`” chưa chắc đủ. Một **ClassLoader định nghĩa (defining ClassLoader)** thường gắn với metadata và quan hệ của các class mà nó định nghĩa; ngược lại, `Class`, instance và nhiều cấu trúc khi chạy có thể dẫn tham chiếu trở lại ClassLoader.

Vì vậy chỉ một tham chiếu nhỏ từ vùng sống lâu sang plugin cũng có thể giữ cả đồ thị ClassLoader tồn tại sau khi triển khai lại (redeploy).

Các phương thức như `append` được đồng bộ hóa theo đối tượng `StringBuffer`, giúp tránh một số tranh chấp ở mức từng lời gọi phương thức khi nhiều luồng cùng truy cập.

Đánh đổi là chi phí đồng bộ hóa và tranh chấp tài nguyên.

Nếu bộ đệm chỉ được dùng trong phạm vi một luồng hoặc một phương thức, `StringBuilder` thường đơn giản và nhanh hơn.

### Cơ chế đồng bộ đảm bảo điều gì?

Ở mức khái niệm:

```text
luồng A gọi append(...)
        │
        └── synchronized trên cùng đối tượng StringBuffer

luồng B gọi append(...)
        │
        └── phối hợp qua cùng monitor cho lời gọi phương thức đó
```

Điều này khác `StringBuilder`, nơi API không cung cấp cơ chế đồng bộ hóa nội bộ tương tự.

Nhưng “có phương thức synchronized” không có nghĩa mọi chuỗi nhiều bước đều nguyên tử (atomic).

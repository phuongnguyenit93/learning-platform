Compatibility contract là tập giả định mà host và plugin cùng dựa vào để có thể chạy với nhau qua nhiều phiên bản.

Nó rộng hơn việc “cùng compile”:

```text
binary compatibility
→ class/method signature vẫn link được

source compatibility
→ provider source cũ vẫn compile lại được

semantic compatibility
→ cùng API nhưng hành vi/ý nghĩa không đổi theo cách phá host

configuration/data compatibility
→ plugin vẫn hiểu config/data contract cần thiết
```

Ví dụ thêm một method vào SPI có thể ảnh hưởng source/binary compatibility; đổi meaning của `supports()` mà giữ nguyên signature lại là semantic break.

Host-plugin contract nên ghi rõ:

- API version hoặc capability version;
- giả định về vòng đời;
- quy tắc về thread và tài nguyên;
- hành vi khi xảy ra lỗi;
- required vs optional features.

`ServiceLoader` không kiểm tra compatibility ở mức ứng dụng. Loader chỉ xác nhận provider phù hợp contract nạp service của platform; ứng dụng vẫn phải tự kiểm tra compatibility mà nó yêu cầu.

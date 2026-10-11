Một quy trình chẩn đoán tốt luôn tách ba thứ thường bị trộn lẫn: **điều quan sát được**, **giả thuyết giải thích**, và **nguyên nhân gốc**.

Ví dụ:

```text
Quan sát:
  p95 latency tăng từ 100 ms lên 4 s

Giả thuyết A:
  nhiều request đang chờ cùng một lock

Giả thuyết B:
  GC pause kéo dài

Giả thuyết C:
  downstream I/O bị chậm
```

Chưa giả thuyết nào là kết luận. Bạn cần chọn bằng chứng có khả năng phân biệt chúng: nhiều thread dump theo thời gian cho A, GC log/JFR cho B, stack và I/O event cho C.

Một vòng lặp thực tế thường có dạng:

1. **Xác định triệu chứng và thời điểm** — lỗi xảy ra lúc nào, với request nào, kéo dài bao lâu, có lặp lại không.
2. **Khoanh vùng subsystem** — thread/liveness, Java heap, GC, native memory, CPU, I/O hay crash.
3. **Đặt giả thuyết có thể bác bỏ** — ví dụ “worker threads đang chờ cùng một monitor”, không phải “Java đang bị treo”.
4. **Chọn bằng chứng rẻ nhất có thể phân biệt giả thuyết**.
5. **Thu thập và đối chiếu theo thời gian** — tránh kết luận từ một ảnh chụp nếu vấn đề mang tính xu hướng.
6. **Cập nhật giả thuyết** — dữ liệu không phù hợp thì bỏ giả thuyết, không cố ép dữ liệu khớp với suy đoán ban đầu.
7. **Xác nhận nguyên nhân bằng hành vi có thể tái kiểm tra** — sau khi sửa, tín hiệu liên quan phải thay đổi theo dự đoán.

Một nguyên nhân gốc tốt phải giải thích được cả triệu chứng lẫn bằng chứng. Ví dụ “heap gần đầy” chưa phải nguyên nhân gốc; “cache không giới hạn giữ lại hàng triệu entry không còn cần thiết, khiến live set tăng qua mỗi chu kỳ tải” là giả thuyết cụ thể hơn và có thể kiểm tra bằng histogram, heap dump và xu hướng theo thời gian.

Thói quen quan trọng nhất là ghi lại **dòng thời gian**. Thread dump lúc 10:01, GC pause lúc 10:01:03 và latency spike lúc 10:01:03 có giá trị hơn ba nguồn dữ liệu không có quan hệ thời gian.

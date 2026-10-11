Application liên tục tạo object có lifetime rất khác nhau. Nếu mỗi đoạn Java code phải tự quyết chính xác khi nào free từng object, chương trình sẽ dễ gặp use-after-free, double-free và memory leak do ownership phức tạp.

Managed heap đổi bài toán:

```text
ứng dụng
→ tạo và sử dụng object

runtime/GC
→ xác định object nào còn reachable
→ thu hồi vùng lưu trữ khi phù hợp
```

Lập trình viên Java vẫn phải quản lý **logical lifetime** bằng reference và resource lifecycle, nhưng không trực tiếp free heap object.

Đổi lại, runtime phải theo dõi reachability và thực hiện collection khi cần, tạo đánh đổi giữa pause, throughput và mức chiếm dụng bộ nhớ.

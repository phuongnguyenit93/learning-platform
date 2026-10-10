Chọn công cụ nên bắt đầu từ **câu hỏi**, không bắt đầu từ tên lệnh.

| Câu hỏi | Bằng chứng đầu tiên nên cân nhắc |
| --- | --- |
| JVM nào đang chạy và chạy với option gì? | `jcmd -l`, `VM.version`, `VM.command_line`, `VM.flags` |
| Ứng dụng treo hoặc nhiều request không tiến triển? | `Thread.print` nhiều lần; virtual-thread-aware dump khi cần |
| Có dấu hiệu deadlock/lock contention? | thread dump với thông tin lock, sau đó đối chiếu nhiều ảnh chụp |
| Heap đang chứa loại object nào nhiều? | `GC.class_histogram` |
| Cần xem object-retention graph chi tiết? | heap dump |
| Hành vi Heap/GC thay đổi theo thời gian? | GC logs, `jstat`, JFR |
| Bộ nhớ tiến trình tăng nhưng heap không giải thích được? | NMT nếu đã bật; chuyển sang chương Native Memory |
| Cần dòng thời gian CPU/allocation/lock/I/O event? | JFR |

Cùng một triệu chứng có thể cần nhiều nguồn. Ví dụ “memory tăng” nên được tách:

```text
RSS/bộ nhớ tiến trình tăng
        ↓
Java heap tăng?
  ├─ có → histogram / heap dump / bằng chứng GC
  └─ không → bằng chứng native memory / bằng chứng OS
```

Một lỗi phổ biến là lấy heap dump chỉ vì thấy bộ nhớ tiến trình cao. Heap dump chỉ mô tả Java heap; nếu mức tăng đến từ cấu trúc native của JVM hoặc thư viện native, dữ liệu đó có thể không trả lời câu hỏi.

Tương tự, một thread dump đơn lẻ không phải profiler. Nó có thể chỉ ra stack đang chạy tại một thời điểm, nhưng nếu câu hỏi là “method nào tiêu tốn CPU trong 20 phút”, sampling/event data như JFR phù hợp hơn.

Quy tắc chọn công cụ:

1. Viết câu hỏi thành một câu có thể trả lời bằng dữ liệu.
2. Xác định cần ảnh chụp hay dòng thời gian.
3. Chọn dữ liệu chẩn đoán nhỏ nhất có đủ thông tin.
4. Kiểm tra tác động và quyền truy cập.
5. Chỉ tăng độ nặng khi bằng chứng hiện tại chưa phân biệt được các giả thuyết.

Đây là lý do module bắt đầu bằng tư duy chẩn đoán trước khi học từng công cụ.

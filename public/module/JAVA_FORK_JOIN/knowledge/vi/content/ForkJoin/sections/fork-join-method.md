Để hiểu về 4 từ khóa này, hãy tưởng tượng **Fork/Join Framework** giống như một vị tướng quân đang điều hành một đội quân để xử lý một công việc khổng lồ (ví dụ: quét sạch 1 triệu quân địch).

## 1. Fork (Chia nhánh)
* **Mệnh lệnh:** *"Chia nhỏ việc ra và giao cho cấp dưới!"*
* **Ý nghĩa:** Khi một nhiệm vụ quá lớn, bạn dùng `fork()` để tách nó thành một nhiệm vụ con (sub-task) và đẩy vào hàng đợi (Work Queue).
* **Hành động:** Nó không chạy ngay lập tức tuần tự mà được gửi vào "kho việc". Các luồng rảnh tay khác sẽ "trộm" (steal) việc về làm.

## 2. Compute (Thực hiện/Tính toán)
* **Mệnh lệnh:** *"Bắt tay vào làm việc đi!"*
* **Ý nghĩa:** Phương thức chứa logic thực tế, là "trái tim" của mọi Task.
* **Hành động:** Kiểm tra điều kiện dừng (Threshold):
    * Nếu việc đủ nhỏ $\rightarrow$ Làm luôn (tính toán trực tiếp).
    * Nếu việc còn to $\rightarrow$ Tiếp tục gọi `fork()` để chia nhỏ thêm.

## 3. Join (Gộp kết quả)
* **Mệnh lệnh:** *"Báo cáo kết quả lại đây cho tôi!"*
* **Ý nghĩa:** Khi đã giao việc (fork), bạn cần kết quả của nó. `join()` khiến luồng hiện tại dừng lại và đợi cho đến khi nhiệm vụ con hoàn thành.
* **Hành động:** Trả về kết quả sau khi tính toán xong. Trong khi đợi, luồng này có thể đi "trộm" việc khác để tránh lãng phí.

## 4. Invoke (Kích hoạt/Triệu tập)
* **Mệnh lệnh:** *"Tổng tấn công! Bắt đầu toàn bộ quy trình!"*
* **Ý nghĩa:** Điểm khởi đầu (Entry Point) để gửi nhiệm vụ lớn nhất vào `ForkJoinPool`.
* **Hành động:** Thực hiện nhiệm vụ, đợi hoàn thành và trả về kết quả cuối cùng.

---

## Tóm tắt quy trình (Workflow)

Cách chúng phối hợp trong dự án `java-learning`:
1.  **invoke:** Bạn ném 1 triệu bản ghi vào và bảo "Làm đi!".
2.  **compute:** Nhiệm vụ bắt đầu xem xét 1 triệu bản ghi.
3.  **fork:** Thấy 1 triệu quá to, nó xẻ đôi, ném 500k bản ghi sang một nhánh bên cạnh.
4.  **compute (đệ quy):** Nhánh con lại xẻ tiếp cho đến khi đạt ngưỡng (ví dụ 10k bản ghi) thì tự tính toán.
5.  **join:** Các nhánh lớn thu thập kết quả từ các nhánh nhỏ và gộp lại thành danh sách tổng.

### Sự khác biệt quan trọng:
| Từ khóa | Hành động | Trạng thái |
| :--- | :--- | :--- |
| **fork()** | Gửi đi | Bất đồng bộ (Không đợi) |
| **join()** | Lấy về | Đồng bộ (Phải đợi) |
| **invoke()** | Khởi chạy | Chạy từ đầu đến cuối & lấy kết quả |

Ví dụ minh họa cấu trúc:
```java
    if (task.isSmall()) {
    return task.computeDirectly();
    } else {
    SubTask left = new SubTask(...);
    SubTask right = new SubTask(...);

            left.fork(); // Đẩy nhánh trái vào hàng đợi
            return right.compute() + left.join(); // Tính nhánh phải và gộp kết quả nhánh trái
        }
```

Trong Distributed Tracing, Trace ID và Span ID là hai chiếc "chìa khóa" quan trọng nhất để xâu chuỗi hàng nghìn dòng log rời rạc thành một câu chuyện hoàn chỉnh về hành trình của một request.

### 1. Trace ID (Định danh toàn hành trình)
Hãy tưởng tượng một **Trace ID** giống như một **Mã vận đơn (Tracking Number)** của một kiện hàng.

* **Đặc điểm:** Khi khách hàng nhấn nút "Đặt hàng", một Trace ID duy nhất được sinh ra (ví dụ: `abc-123`).
* **Phạm vi:** Nó được giữ nguyên suốt cả hành trình. Dù request đi qua Gateway, sang Order Service, nhảy qua Payment Service, tất cả đều dùng chung một mã `abc-123`.
* **Mục đích:** Giúp bạn tìm được tất cả các log liên quan đến một request cụ thể giữa hàng triệu request khác.

### 2. Span ID (Định danh từng chặng dừng)
Nếu Trace ID là mã vận đơn cho cả quãng đường, thì **Span ID** giống như mã định danh cho từng chặng (ví dụ: nhập kho, vận chuyển, giao hàng).

* **Đặc điểm:** Mỗi khi request thực hiện một công việc cụ thể (gọi API, truy vấn DB, đọc file), một Span ID mới sẽ được sinh ra.
* **Cấu trúc cha-con:** Span ID có tính phân cấp. Một chặng lớn (**Parent Span**) có thể chứa nhiều chặng nhỏ (**Child Spans**).
* **Mục đích:** Giúp bạn biết chính xác bước nào trong hệ thống đang chạy chậm hoặc bị lỗi.

---

### 3. Mối quan hệ giữa Trace ID và Span ID

Dưới đây là sơ đồ logic về cách chúng phối hợp:

* **Trace (Hành trình tổng):** `Trace ID = 69dd1766...`
  * **Chặng 1 (Gửi Order):** `Span ID = A`
  * **Chặng 2 (Kiểm tra kho):** `Span ID = B` (là con của A)
  * **Chặng 3 (Thanh toán):** `Span ID = C` (là con của A)

---

### 4. Bảng so sánh nhanh

| Đặc điểm | Trace ID | Span ID |
| :--- | :--- | :--- |
| **Số lượng** | Chỉ có 1 duy nhất cho mỗi request. | Có nhiều cái, sinh ra theo từng đơn vị công việc. |
| **Giá trị** | Dùng để nhóm (Group) dữ liệu lại. | Dùng để đo thời gian (Duration) của từng bước. |
| **Câu hỏi trả lời** | "Chuyện gì đã xảy ra với request của User X?" | "Tại sao bước gọi Database lại mất tới 2 giây?" |

---

### 5. Ví dụ thực tế từ Zipkin
Trong giao diện Zipkin khi bạn thực hiện truy vết:

1.  Dòng trên cùng có mã dài (ví dụ: `69dd1766361cc99fba9ccc12a9e1976b`) chính là **Trace ID**.
2.  Mỗi thanh ngang màu xanh bên dưới (như `authenticate`, `http get`) tương ứng với một **Span ID** riêng biệt.
3.  Khi bạn click vào một thanh xanh, bạn sẽ thấy thông tin chi tiết của chặng đó (Span) nhưng vẫn thấy nó thuộc về hành trình chung (Trace).

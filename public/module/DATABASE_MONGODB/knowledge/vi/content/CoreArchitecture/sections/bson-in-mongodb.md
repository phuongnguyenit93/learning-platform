Câu trả lời nằm ở sự cân bằng giữa **tốc độ xử lý của máy tính** và **sự tiện dụng của con người**. Dưới đây là lý do tại sao BSON (Binary JSON) là "xương sống" của MongoDB.

## 1. BSON là gì?
**BSON** viết tắt của **Binary JSON**. Đây là một định dạng lưu trữ nhị phân được MongoDB dùng để lưu các Document trên đĩa cứng và truyền tải qua mạng.
* **JSON:** Định dạng văn bản dành cho con người đọc (Text-based).
* **BSON:** Định dạng nhị phân dành cho máy tính đọc (Binary-based).

## 2. 3 Lý do cốt lõi khiến BSON vượt trội

### A. Hỗ trợ nhiều kiểu dữ liệu hơn (Rich Data Types)
JSON rất hạn chế, nó chỉ hiểu: *String, Number, Boolean, Array, Object và Null*. Nó không hiểu thế nào là một ngày tháng (`Date`) hay một dãy số định danh (`ObjectId`).

* **Trong JSON:** Bạn phải lưu ngày tháng là String `"2026-03-28"`. Khi cần so sánh, máy tính phải mất công parse chuỗi đó ra lại.
* **Trong BSON:** Có kiểu dữ liệu **Date** và **Timestamp** riêng biệt dưới dạng số nguyên 64-bit. Việc so sánh ngày tháng cực kỳ nhanh. Ngoài ra còn hỗ trợ: `Decimal128` (tiền tệ), `BinData` (ảnh/file nhỏ), `RegExp`...

### B. Tốc độ quét và Duyệt dữ liệu (Efficiency & Scanning)
Hãy tưởng tượng bạn có một Document dài 1MB và muốn tìm trường cuối cùng tên là `status`.

* **Với JSON:** Máy tính phải đọc từng ký tự từ đầu đến cuối, đếm từng dấu ngoặc `{}` để biết khi nào một object kết thúc. Rất tốn CPU.
* **Với BSON:** Mỗi field đều có một **tiền tố (prefix)** ghi rõ độ dài (Size) của nó. Máy tính có thể "nhảy" (skip) qua các field không cần thiết để đi thẳng tới field nó cần. Tốc độ truy vấn tăng vọt.

### C. Tối ưu hóa cho Indexing
Nhờ cấu trúc nhị phân và độ dài cố định cho các kiểu dữ liệu số, MongoDB có thể xây dựng các cây chỉ mục (**B-Tree**) trên BSON hiệu quả hơn nhiều so với việc băm (hash) các chuỗi văn bản JSON.

## 📊 So sánh nhanh: JSON vs BSON

| Đặc điểm | JSON | BSON |
| :--- | :--- | :--- |
| **Định dạng** | Văn bản (Text) | Nhị phân (Binary) |
| **Khả năng đọc** | Con người dễ đọc | Máy tính dễ đọc |
| **Kiểu dữ liệu** | Ít (6 kiểu) | Nhiều (Date, BinData, ObjectId...) |
| **Tốc độ xử lý** | Chậm (phải parse) | Rất nhanh (nhảy cóc được) |
| **Kích thước** | Thường nhỏ hơn | Thường lớn hơn một chút (do chứa metadata) |

## 🛠️ BSON trong thực tế (Project Java của bạn)

Khi bạn dùng **Spring Data MongoDB** trong project `java-learning`:
1. Bạn viết Code Java (Object).
2. Driver sẽ chuyển Object đó thành **BSON** để gửi lên MongoDB Atlas.
3. Khi bạn xem trên Navicat/Compass, các công cụ này chuyển ngược BSON thành **JSON** để bạn dễ đọc.

---

### 💡 Sự thật thú vị:
Cái tên `_id` với giá trị `ObjectId("...")` mà bạn thấy chính là một kiểu dữ liệu 12-byte đặc trưng của BSON. Nó giúp đảm bảo tính duy nhất trên toàn cầu mà không cần cơ chế tăng số tự động (**Auto-increment**) vốn rất khó thực hiện trong hệ thống phân tán.

```java
	// Ví dụ minh họa ObjectId trong BSON (12-byte)
	// 4 byte: Timestamp | 5 byte: Random value | 3 byte: Increment counter
	ObjectId myId = new ObjectId();
	System.out.println("BSON ObjectId: " + myId.toHexString());
```

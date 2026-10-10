Thay vì dùng kiểu số tự động tăng (Auto-increment) dễ gây xung đột khi mở rộng nhiều server, MongoDB sử dụng **ObjectId** — một cấu trúc 12-byte (hiển thị dưới dạng 24 ký tự Hex) đảm bảo tính duy nhất trên toàn cầu.

## 1. Phân rã cấu trúc 12-byte

Cấu trúc này được chia thành 3 phần chiến lược:

| Thành phần | Kích thước | Ý nghĩa |
| :--- | :--- | :--- |
| **Timestamp** | 4 bytes | Lưu thời gian (giây) khi Document được tạo (Unix Epoch). |
| **Random Value** | 5 bytes | Mã định danh duy nhất cho mỗi máy chủ/tiến trình (sinh ngẫu nhiên). |
| **Counter** | 3 bytes | Số đếm tự tăng, bắt đầu bằng một giá trị ngẫu nhiên. |

## 2. Sức mạnh của 4 byte Timestamp đầu tiên

Đây là phần "vi diệu" nhất trong thiết kế của MongoDB:
* **Tiết kiệm dung lượng:** Bạn không nhất thiết phải tạo thêm trường `created_at` (tốn thêm 8 byte) nếu chỉ cần biết thời gian tạo cơ bản.
* **Sắp xếp mặc định:** Vì Timestamp nằm ở đầu, các ObjectId tạo sau thường có giá trị lớn hơn. Khi bạn thực hiện `sort({ _id: 1 })`, thực chất bạn đang sắp xếp theo thời gian tạo mà không cần thêm Index phụ.

## 3. Cách trích xuất thời gian từ ObjectId trong Java

Trong project `java-learning`, nếu bạn dùng MongoDB Java Driver, việc lấy thời gian cực kỳ đơn giản:

```java
	// Trích xuất thông tin từ ObjectId
	ObjectId id = document.getObjectId("_id");

	// Trả về đối tượng Date chứa ngày giờ tạo
	Date creationDate = id.getDate(); 

	// Trả về thời gian dạng Unix timestamp (giây)
	long epochTime = id.getTimestamp();
```

* **Mẹo:** Trong Mongo Shell, bạn chỉ cần gõ: `ObjectId("...").getTimestamp()`.

## 4. Tại sao cần 5 byte Random và 3 byte Counter?

* **5 byte Random:** Đảm bảo nếu hai máy chủ khác nhau cùng tạo bản ghi vào **cùng một giây**, chúng vẫn không trùng ID nhờ mã máy ngẫu nhiên khác nhau.
* **3 byte Counter:** Đảm bảo trên **cùng một máy**, nếu bạn tạo hàng ngàn bản ghi trong cùng một giây, số đếm này sẽ tăng dần (tối đa $16,777,216$ giá trị trong 1 giây) để tránh trùng lặp tuyệt đối.

---

### 💡 Mẹo tối ưu cho Backend Developer:

Nếu bạn cần lọc dữ liệu theo ngày (ví dụ: lấy các đơn hàng tạo trong ngày hôm nay), việc lọc qua trường `_id` sẽ nhanh hơn rất nhiều so với lọc qua một trường `date` tự tạo. Lý do là `_id` luôn có **Index mặc định** và dữ liệu được sắp xếp vật lý theo thứ tự thời gian này, giúp giảm thiểu việc quét đĩa (Disk I/O).

```java
	// Tư duy tối ưu: Tìm theo ID thay vì tìm theo Date field
	Query query = new Query(Criteria.where("_id").gte(minObjectIdForToday));
```

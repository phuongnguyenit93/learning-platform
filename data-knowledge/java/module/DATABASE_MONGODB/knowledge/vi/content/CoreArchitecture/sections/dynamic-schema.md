Trong MongoDB, **Schema (Lược đồ) là động**. Điều này có nghĩa là trong cùng một **Collection** (tương đương với Bảng), mỗi **Document** (tương đương với Dòng) có thể có cấu trúc hoàn toàn khác nhau.

## 1. Sự khác biệt về tư duy: Cố định vs. Linh hoạt

* **SQL (Static Schema):** Giống như một cuốn biểu mẫu in sẵn. Nếu bạn muốn thêm một thông tin mới (ví dụ: số điện thoại thứ 2), bạn phải sửa lại toàn bộ biểu mẫu bằng lệnh `ALTER TABLE`.
* **MongoDB (Dynamic Schema):** Giống như một tờ giấy trắng. Bạn muốn viết gì vào đó cũng được. Document 1 có thể có 3 trường, Document 2 có 10 trường, và Document 3 lại có các trường lồng nhau phức tạp.

## 2. Ví dụ thực tế trong Project java-learning

Giả sử bạn quản lý một Collection `products`. Mỗi loại sản phẩm sẽ có những thông số kỹ thuật (specs) đặc thù:

```json
	// Document 1: Laptop (Cần RAM, CPU)
	{
	  "name": "MacBook M3",
	  "type": "Electronics",
	  "specs": { "cpu": "M3", "ram": "16GB" }
	}

	// Document 2: Áo thun (Cần Size, Chất liệu)
	{
	  "name": "Polo Shirt",
	  "type": "Clothing",
	  "size": "L",
	  "material": "Cotton"
	}
```
Trong SQL, bạn sẽ phải tạo rất nhiều bảng con (Join) hoặc để cực kỳ nhiều cột `NULL`. Trong MongoDB, bạn chỉ việc đẩy chúng vào cùng một chỗ.

## 3. Lợi ích của Schema động

* **Phát triển cực nhanh (Agility):** Cứ code đến đâu, thêm trường đến đó. Không cần tốn thời gian họp bàn để thống nhất Schema hay chạy script migrate DB phức tạp.
* **Hỗ trợ dữ liệu biến đổi:** Cực kỳ phù hợp cho hệ thống **IoT** (mỗi cảm biến gửi dữ liệu khác nhau) hoặc **E-commerce** (sản phẩm đa dạng chủng loại).
* **Tiết kiệm bộ nhớ:** Bạn chỉ lưu những gì bạn thực sự có. Không có các giá trị `NULL` dư thừa chiếm dụng không gian như trong SQL.

## 4. Mặt trái cần lưu ý (Cảnh báo cho Backend Developer)

"Quyền năng lớn đi kèm trách nhiệm lớn". Schema linh hoạt không có nghĩa là bạn nên làm việc cẩu thả:

* **Gánh nặng dồn lên Code Java:** Database không bắt lỗi cấu trúc, nên Code Java phải kiểm tra kỹ (`null-check`). Nếu gọi `product.getSpecs()` trên một bản ghi "Áo thun", bạn sẽ dính ngay `NullPointerException`.
* **Khó thống kê:** Nếu đặt tên trường không đồng nhất (lúc thì `price`, lúc thì `cost`), việc viết câu query tính tổng doanh thu sẽ là một thảm họa.

---

### 💡 Mẹo: Schema Validation cho dự án lớn

Dù là Dynamic Schema, nhưng khi dự án `java-learning` của bạn lớn dần, bạn nên sử dụng tính năng **Schema Validation**. Nó cho phép bạn bắt buộc một số trường cốt lõi "phải có" (ví dụ: mọi sản phẩm đều phải có `name` và `price`).

**Tư duy đúng:** Hãy dùng NoSQL để linh hoạt ở những chỗ cần linh hoạt, nhưng hãy giữ kỷ luật thép ở những dữ liệu quan trọng nhất.

```javascript
	// Ví dụ lệnh tạo Validation trong MongoDB Shell
	db.createCollection("products", {
	   validator: {
	      $jsonSchema: {
	         required: [ "name", "price" ]
	      }
	   }
	})
```

Trong MongoDB, một **Document** là đơn vị lưu trữ dữ liệu cơ bản (tương đương với một *Row* trong SQL), nhưng linh hoạt hơn nhiều nhờ cấu trúc phân cấp và khả năng lồng ghép.

## 1. Field (Trường) và Value (Giá trị)
Đây là cặp Key-Value cơ bản nhất.
* **Field:** Tên của thuộc tính (luôn là kiểu String). **Lưu ý:** Có phân biệt chữ hoa/chữ thường (`name` khác `Name`).
* **Value:** Giá trị của thuộc tính (String, Number, Boolean, Date, hoặc Object/Array).

  ```json
  {
    "name": "Laptop Gaming",  // Field: "name", Value: "Laptop Gaming"
    "price": 2500,            // Field: "price", Value: 2500
    "in_stock": true          // Field: "in_stock", Value: true
  }
  ```

## 2. Nested Documents (Document lồng nhau)
Đây là điểm "ăn tiền" nhất. Một Field có thể chứa một Document khác bên trong, giúp gom dữ liệu liên quan mà không cần tách bảng (No JOIN).

* **Ví dụ:** Thay vì để `city`, `street` rời rạc, ta gom chúng vào object `address`.
* **Dot Notation:** Bạn dùng dấu chấm để truy cập sâu: `address.city`.

  ```json
  {
    "customer_name": "Nguyen Van A",
    "address": {
      "street": "123 Đường ABC",
      "city": "Ho Chi Minh",
      "zipcode": 70000
    }
  }
  ```

## 3. Arrays (Mảng)
MongoDB cho phép một Field chứa một danh sách các giá trị, từ đơn giản đến phức tạp.
* **Mảng đơn giản:** Lưu danh sách các nhãn (`tags`).
* **Mảng Document:** Lưu danh sách các đối tượng con (ví dụ: các `reviews` của sản phẩm).

  ```json
  {
    "product": "iPhone 15",
    "tags": ["apple", "smartphone", "ios"],
    "reviews": [
      { "user": "Tuấn", "rating": 5, "comment": "Rất tốt" },
      { "user": "Hoa", "rating": 4, "comment": "Hơi đắt" }
    ]
  }
  ```

## 4. So sánh nhanh với SQL

| Thành phần | Trong SQL (Relational) | Trong MongoDB (Document) |
| :--- | :--- | :--- |
| **Đơn vị lưu trữ** | Dòng (Row) | Document (BSON) |
| **Cấu trúc con** | Phải tách ra bảng khác (**JOIN**) | Lồng trực tiếp (**Nested**) |
| **Danh sách con** | Phải tạo bảng quan hệ 1-N | Lưu dạng **Mảng (Array)** |

## 5. Tại sao cấu trúc này lại mạnh mẽ?

* **Tính cục bộ của dữ liệu (Data Locality):** Khi đọc một bản ghi, bạn có toàn bộ thông tin liên quan ngay lập tức. CPU không cần tốn công đi "tìm kiếm" dữ liệu ở các bảng khác qua lệnh JOIN phức tạp.
* **Tính đa hình (Polymorphism):** Document A có thể có mảng `tags`, nhưng Document B trong cùng Collection có thể không cần field đó hoặc thay bằng field `category`. MongoDB không bắt lỗi Schema (Schema-less).

---

### 💡 Áp dụng vào dự án java-learning:
Khi bạn sử dụng **Spring Data MongoDB**, các POJO Java của bạn sẽ được ánh xạ (mapping) trực tiếp:
* `@Document`: Ánh xạ Class thành một Collection.
* `@Id`: Ánh xạ trường ID (thường là `ObjectId`).
* `List<Review>`: Sẽ tự động được chuyển thành một **Array** các Nested Documents trong MongoDB.

```java
  @Document(collection = "products")
  public class Product {
      @Id
      private String id;
      private String name;
      private Address address; // Nested Document
      private List<String> tags; // Array
  }
```

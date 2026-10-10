**ACID** là tập hợp 4 đặc tính vàng đảm bảo các giao dịch trên cơ sở dữ liệu (**Database Transaction**) được thực hiện một cách tin cậy, ngay cả khi có sự cố phần cứng hay lỗi phần mềm.

## 1. Giải mã 4 chữ cái trong ACID

### A - Atomicity (Tính nguyên tử)
Quy tắc **"Tất cả hoặc không có gì"**.
* Một giao dịch gồm nhiều bước (Trừ tiền ví A -> Cộng tiền ví B).
* Nếu một bước thất bại, toàn bộ giao dịch sẽ bị hủy bỏ (**Rollback**). Dữ liệu quay lại trạng thái ban đầu như chưa có chuyện gì xảy ra.

### C - Consistency (Tính nhất quán)
Đảm bảo dữ liệu luôn tuân thủ các quy tắc nghiệp vụ sau khi giao dịch kết thúc.
* **Ví dụ:** Tổng số tiền trong hệ thống không đổi sau khi chuyển khoản, hoặc các ràng buộc `NOT NULL`, `UNIQUE` luôn được thỏa mãn.

### I - Isolation (Tính cô lập)
Đảm bảo các giao dịch chạy đồng thời không ảnh hưởng lẫn nhau.
* Nếu hai người cùng rút tiền từ một tài khoản, hệ thống sẽ cách ly sao cho số dư cuối cùng luôn chính xác, không bị tình trạng "ghi đè" (Race Condition).

### D - Durability (Tính bền vững)
Khi hệ thống báo "Thành công", dữ liệu đó phải được lưu **vĩnh viễn** vào ổ cứng.
* Ngay cả khi Server sập hay mất điện ngay sau giây đó, dữ liệu vẫn phải tồn tại khi hệ thống khởi động lại.

---

## 2. MongoDB có hỗ trợ ACID không?

Đây là một hiểu lầm phổ biến: *"NoSQL thì không có ACID"*. Thực tế là:
* **Trước đây:** MongoDB chỉ hỗ trợ ACID trên đơn bản ghi (**Single-document**).
* **Hiện nay (Từ v4.0+):** MongoDB đã hỗ trợ **Multi-document Transactions**. Bạn có thể thực hiện thay đổi trên nhiều Collection khác nhau trong cùng một Transaction một cách an toàn.

## 3. Thực hành ACID trong Spring Boot (Dự án java-learning)

Khi dùng **Spring Data MongoDB**, bạn có thể áp dụng ACID cực kỳ dễ dàng bằng Annotation `@Transactional`:

```java
	@Service
	public class BankService {

	    @Transactional // <--- Kích hoạt cơ chế ACID cho phương thức này
	    public void transferMoney(String fromId, String toId, double amount) {
	        // 1. Trừ tiền ví A
	        accountRepository.decreaseBalance(fromId, amount);

	        // Giả sử ở đây xảy ra lỗi Logic hoặc lỗi Mạng...

	        // 2. Cộng tiền ví B
	        accountRepository.increaseBalance(toId, amount);

	        // Nhờ @Transactional, nếu bước 2 lỗi, bước 1 sẽ tự động Rollback!
	    }
	}
```

---

## 📊 Khi nào có thể "nới lỏng" ACID?

Dù ACID rất tốt, nhưng nó làm hệ thống chạy chậm hơn vì tốn tài nguyên để "canh giữ". Bạn có thể ưu tiên hiệu năng hơn ACID khi:
* **Lưu Log hệ thống:** Mất một vài dòng log không gây hậu quả nghiêm trọng.
* **Lưu lượt Like, View:** Sai lệch 1-2 đơn vị không quá quan trọng đối với trải nghiệm người dùng.
* **Dữ liệu thống kê:** Không liên quan đến tiền bạc, pháp lý hay các ràng buộc chặt chẽ.

### 💡 Lời khuyên cho Backend Developer:
Trong Microservices, việc duy trì ACID trên nhiều Service khác nhau là cực kỳ khó (Distributed Transaction). Lúc này, người ta thường dùng **Saga Pattern** mà chúng ta đã thảo luận để thay thế cho ACID truyền thống.

# Giải mã: Tại sao MongoDB không sử dụng HikariCP?

Khi chuyển từ RDBMS (MySQL, PostgreSQL) sang NoSQL (MongoDB), một trong những thay đổi lớn nhất ở tầng hạ tầng là cách quản lý kết nối. MongoDB **không cần** HikariCP vì nó có "vũ khí" riêng.

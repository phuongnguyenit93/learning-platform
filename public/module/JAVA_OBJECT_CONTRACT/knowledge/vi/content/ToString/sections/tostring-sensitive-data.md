Không nên đưa mật khẩu, token, bí mật, đầy đủ dữ liệu thanh toán hoặc thông tin nhạy cảm vào `toString` chỉ vì chúng là trường dữ liệu của đối tượng.

Ví dụ không nên:

```java
@Override
public String toString() {
    return "LoginRequest[user=" + user
            + ", password=" + password + "]";
}
```

### TẠI SAO RỦI RO LỚN?

`toString` có thể xuất hiện qua:

- ghi log;
- nối chuỗi;
- IDE/trình gỡ lỗi;
- lỗi của phép kiểm tra (`assertion`) hoặc kiểm thử;
- thông báo ngoại lệ;
- biểu diễn gián tiếp của cấu trúc dữ liệu hoặc đối tượng.

Một trường dữ liệu nhạy cảm lọt vào `toString` có thể bị ghi ra log ở môi trường vận hành thực tế dù lập trình viên không chủ động gọi nó tại điểm đó.

### CHE DỮ LIỆU (REDACTION) VÀ BIỂU DIỄN AN TOÀN

Nếu cần hiển thị thông tin nhận diện, hãy cân nhắc biểu diễn đã che hoặc lược bỏ dữ liệu nhạy cảm:

```java
@Override
public String toString() {
    return "PaymentCard[last4=" + last4 + "]";
}
```

Chính sách bảo mật cụ thể thuộc mô-đun bảo mật chuyên sâu hơn, nhưng ranh giới ở đây rất rõ: **`toString` là bề mặt chẩn đoán, không phải nơi mặc định phơi bày toàn bộ trạng thái**.

Sau cách đối tượng tự mô tả, hai chương cuối chuyển sang một nhóm quy ước khác: **thứ tự sắp xếp** — đối tượng nào đứng trước đối tượng nào, và ai sở hữu chính sách đó.

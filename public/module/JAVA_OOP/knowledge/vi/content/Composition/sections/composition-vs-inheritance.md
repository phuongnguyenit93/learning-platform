Hai cơ chế giải quyết hai loại quan hệ khác nhau:

| Câu hỏi | Inheritance | Composition |
| --- | --- | --- |
| Quan hệ chính | is-a | has-a / cộng tác với |
| Dùng lại hành vi | Kế thừa phần triển khai | Ủy quyền |
| Thay đổi hành vi | Ghi đè ở kiểu con | Thay đối tượng cộng tác |
| Mức phụ thuộc | Chặt với class cha | Phụ thuộc vào hợp đồng của đối tượng cộng tác |
| Thay cách triển khai lúc chạy | Thường khó tự nhiên hơn | Tự nhiên nếu đối tượng cộng tác được truyền vào |

### Cách quyết định đơn giản

Nếu đối tượng **thực sự cần được dùng như một kiểu tổng quát hơn (supertype)**, kế thừa có thể phù hợp.

Nếu mục tiêu chủ yếu là:

- dùng lại hành vi;
- thay chiến lược;
- thay cách triển khai;

thì nên xem xét kết hợp đối tượng trước.

Câu “favor composition over inheritance” không có nghĩa là “không bao giờ dùng kế thừa”. Nó nhắc ta không nên dùng kế thừa chỉ như một mẹo để tái sử dụng vài dòng mã khi không có quan hệ kiểu con thực sự.
